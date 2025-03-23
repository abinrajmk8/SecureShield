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
alerts_collection = db["active_alerts"]  # Collection Name

# Logging configuration
logging.basicConfig(level=logging.INFO)

# Time tracking for logging alerts
last_log_time = None

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
    global last_log_time
    current_time = datetime.utcnow()

    # Only log an alert if 20 minutes have passed since the last log
    if last_log_time is None or current_time - last_log_time >= timedelta(minutes=20):
        alert_data = {
            "timestamp": current_time,
            "alert_type": "ARP Spoofing",
            "severity": "high",
            "message": "Possible ARP Spoofing detected!",
            "source_ip": src_ip,
            "expected_mac": real_mac,
            "spoofed_mac": spoofed_mac
        }
        alerts_collection.insert_one(alert_data)
        logging.info("[+] Alert logged to MongoDB")
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

if __name__ == "__main__":
    try:
        logging.info("[+] Running Detector .. ")
        # Start sniffing (Replace with actual network interface name)
        sniff("Intel(R) Wireless-AC 9560 160MHz")

    except KeyboardInterrupt:
        logging.info("\n[+] Detector stopped by user.")
        sys.exit(0)
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        sys.exit(1)
