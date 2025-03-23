import scapy.all as scapy
from pymongo import MongoClient
from datetime import datetime

# MongoDB Connection
MONGO_URI = "mongodb+srv://miniproject07s:G16PObcPYM3KeqYs@network.k0ddo.mongodb.net/?retryWrites=true&w=majority&appName=networkc"
client = MongoClient(MONGO_URI)
db = client["test"]  # Database Name
alerts_collection = db["active_alerts"]  # Collection Name

print("[+] Running Detector .. ")

def get_mac(ip):
    arp_request = scapy.ARP(pdst=ip)
    broadcast = scapy.Ether(dst="ff:ff:ff:ff:ff:ff")
    arp_request_broadcast = broadcast / arp_request
    answered_list = scapy.srp(arp_request_broadcast, timeout=1, verbose=False)[0]
    return answered_list[0][1].hwsrc if answered_list else None

def log_alert(src_ip, real_mac, spoofed_mac):
    alert_data = {
        "timestamp": datetime.utcnow(),
        "alert_type": "ARP Spoofing",
        "severity": "high",
        "message": "Possible ARP Spoofing detected!",
        "source_ip": src_ip,
        "expected_mac": real_mac,
        "spoofed_mac": spoofed_mac
    }
    alerts_collection.insert_one(alert_data)
    print("[+] Alert logged to MongoDB")

def process_sniffed_packet(packet):
    if packet.haslayer(scapy.ARP) and packet[scapy.ARP].op == 2:
        try:
            real_mac = get_mac(packet[scapy.ARP].psrc)
            response_mac = packet[scapy.ARP].hwsrc

            if real_mac and real_mac != response_mac:
                print("[+] You are Under Attack...!!!!!")
                print(f"    [Expected MAC] {real_mac}  |  [Spoofed MAC] {response_mac}")
                log_alert(packet[scapy.ARP].psrc, real_mac, response_mac)
        except IndexError:
            pass

def sniff(interface):
    scapy.sniff(iface=interface, store=False, prn=process_sniffed_packet)

# Start sniffing (Replace with actual network interface name)
sniff("Intel(R) Wireless-AC 9560 160MHz")
