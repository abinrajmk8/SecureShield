import scapy.all as scapy
from pymongo import MongoClient
from datetime import datetime, timedelta
import time
import sys
import logging

# MongoDB Connection
MONGO_URI = "mongodb+srv://miniproject07s:G16PObcPYM3KeqYs@network.k0ddo.mongodb.net/?retryWrites=true&w=majority&appName=networkc"
client = MongoClient(MONGO_URI)
db = client["test"]  # Database Name
security_report_collection = db["securityreports"]  # Collection Name for SecurityReports

# Logging configuration
logging.basicConfig(level=logging.INFO)

# Time tracking for logging alerts
last_log_time = None
count = 1  # Initialize the count variable

def get_mac(ip):
    try:
        arp_request = scapy.ARP(pdst=ip)
        broadcast = scapy.Ether(dst="ff:ff:ff:ff:ff:ff")
        arp_request_broadcast = broadcast / arp_request
        answered_list = scapy.srp(arp_request_broadcast, timeout=1, verbose=False)[0]
        return answered_list[0][1].hwsrc if answered_list else None
    except Exception as e:
        logging.error(f"Error while getting MAC for IP {ip}: {e}")
        return None

def log_alert(src_ip, real_mac, spoofed_mac):
    global last_log_time, count
    current_time = datetime.utcnow()

    # If count is 1, print the message and log it to the database, then set count to 0
    if count == 1:
        alert_data = {
            "timestamp": current_time,
            "type": "ARP Spoofing",
            "severity": "High",  # Set severity level as needed
            "status": "Unresolved",  # Default status
            "description": f"Possible ARP Spoofing detected! Source IP: {src_ip}, Expected MAC: {real_mac}, Spoofed MAC: {spoofed_mac}",
            "sourceIP": src_ip,
            "destinationIP": None,  # ARP usually doesn't have a target IP
            "ports": [],  # No ports involved in ARP spoofing
            "detectedBy": "ARP Detector",
            "recommendation": "Investigate the source IP for potential malicious activity.",
            "devicePriority": "High",  # Default priority
            "macAddress": real_mac,
            "deviceName": "",  # Optional field
        }

        # Insert the alert data into the MongoDB collection
        security_report_collection.insert_one(alert_data)
        logging.info("[+] Alert logged to MongoDB")

        # Reset the count to 0 and start the 20-minute interval timer
        count = 0
        last_log_time = current_time

    else:
        # Only print the suppressed alert message once, not repeatedly
        print("[+] Alert suppressed, waiting 20 minutes for next log.")

def process_sniffed_packet(packet):
    try:
        if packet.haslayer(scapy.ARP) and packet[scapy.ARP].op == 2:
            real_mac = get_mac(packet[scapy.ARP].psrc)
            response_mac = packet[scapy.ARP].hwsrc

            if real_mac and real_mac != response_mac:
                # Print attack detection message only once
                if count == 1:
                    print("[+] You are Under Attack...!!!!!")
                    print(f"    [Expected MAC] {real_mac}  |  [Spoofed MAC] {response_mac}")
                log_alert(packet[scapy.ARP].psrc, real_mac, response_mac)
    except Exception as e:
        logging.error(f"Error processing packet: {e}")

def sniff(interface):
    try:
        scapy.sniff(iface=interface, store=False, prn=process_sniffed_packet)
    except KeyboardInterrupt:
        logging.info("\n[+] Sniffing interrupted by user. Exiting...")
        sys.exit(0)
    except Exception as e:
        logging.error(f"Error during sniffing: {e}")
        sys.exit(1)

# Reset the count after 20 minutes to allow new alerts
def reset_count():
    global count, last_log_time
    while True:
        current_time = datetime.utcnow()
        if last_log_time and current_time - last_log_time >= timedelta(minutes=20):
            count = 1  # Reset the count after 20 minutes
            logging.info("[+] 20 minutes passed. Count reset to 1.")
            last_log_time = current_time
        time.sleep(60)  # Check every minute

if __name__ == "__main__":
    try:
        logging.info("[+] Running Detector .. ")
        # Start sniffing (Replace with actual network interface name)
        sniff("Intel(R) Wireless-AC 9560 160MHz")

        # Start a separate thread to reset count after 20 minutes
        import threading
        threading.Thread(target=reset_count, daemon=True).start()

    except KeyboardInterrupt:
        logging.info("\n[+] Detector stopped by user.")
        sys.exit(0)
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        sys.exit(1)
