import scapy.all as scapy
from scapy.layers import http

# all fns commented on packetsniffer prgm

print("[+] Running Detector .. ")
def get_mac(ip):
    try:
        arp_request = scapy.ARP(pdst=ip)
        broadcast = scapy.Ether(dst="ff:ff:ff:ff:ff:ff")
        arp_request_broadcast = broadcast / arp_request
        answered_list = scapy.srp(arp_request_broadcast, timeout=1, verbose=False)[0]
        
        if answered_list:  # Ensure the response exists
            return answered_list[0][1].hwsrc
        else:
            print(f"[!] No response for {ip}, possible network issue.")
            return None  # Avoid error propagation
        
    except OSError as e:
        print(f"[ERROR] OS Error: {e}")
        return None

    


def sniff(interface):
    scapy.sniff(iface=interface, store=False, prn=process_sniffed_packet)

def process_sniffed_packet(packet):
  
   if packet.haslayer(scapy.ARP) and packet[scapy.ARP].op == 2:
       try:
           real_mac = get_mac(packet[scapy.ARP].psrc)
           response_mac = packet[scapy.ARP].hwsrc

           if real_mac != response_mac:
                print("[+] You are Under attack....!!!!!")
       except IndexError:
           pass
       

sniff("Intel(R) Wireless-AC 9560 160MHz")