import scapy.all as scapy
import logging
from scapy.all import AsyncSniffer
from collections import defaultdict
import time  # Added missing import

# Set up logging (minimal verbosity)
logging.basicConfig(level=logging.WARNING, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger()

# Known MACs
HOST_MAC = "48:68:4a:31:5f:42"  # Windows host
VM_MAC = "00:0c:29:c1:fa:63"    # Ubuntu VM
WHITELIST_MACS = {HOST_MAC, VM_MAC}

# Track ARP responses
arp_history = defaultdict(list)

print(scapy.conf.ifaces)

def get_mac(ip):
    try:
        arp_request = scapy.ARP(pdst=ip)
        broadcast = scapy.Ether(dst="ff:ff:ff:ff:ff:ff")
        arp_request_broadcast = broadcast / arp_request
        answered_list = scapy.srp(arp_request_broadcast, timeout=1, verbose=False)[0]
        if answered_list:
            return answered_list[0][1].hwsrc.lower()  # Normalize to lowercase
        logger.warning(f"No ARP response for IP: {ip}")
        return None
    except Exception as e:
        logger.error(f"Error in get_mac for IP {ip}: {e}")
        return None

def process_sniffed_packet(packet):
    if packet.haslayer(scapy.ARP) and packet[scapy.ARP].op == 2:
        try:
            ip = packet[scapy.ARP].psrc
            response_mac = packet[scapy.ARP].hwsrc.lower()  # Normalize to lowercase
            real_mac = get_mac(ip)

            # Track history (last 10 replies) silently
            timestamp = time.time()
            arp_history[ip].append((response_mac, timestamp))
            arp_history[ip] = arp_history[ip][-10:]

            # Spoofing detection
            if real_mac and real_mac != response_mac:
                if response_mac in WHITELIST_MACS:
                    # Check for persistent mismatch (e.g., >50% of last 10 replies)
                    recent_macs = [mac for mac, _ in arp_history[ip]]
                    mismatch_count = recent_macs.count(response_mac)
                    if mismatch_count > 5:
                        print(f"[+] Persistent mismatch (not spoofing): IP={ip}, Response MAC={response_mac}, Expected={real_mac}")
                else:
                    # Unknown MAC: likely spoofing - vivid output
                    print("\n" + "="*50)
                    print(f"[+] YOU ARE UNDER ATTACK....!!!!! (IP: {ip}, Spoofed MAC: {response_mac}, Expected: {real_mac})")
                    print("="*50 + "\n")
        except Exception as e:
            logger.error(f"Error processing packet: {e}")

def sniff(interface):
    print("[+] Running detector... (Press Ctrl+C to stop)")
    sniffer = AsyncSniffer(iface=interface, store=False, prn=process_sniffed_packet)
    sniffer.start()
    try:
        while True:  # Run indefinitely until interrupted
            sniffer.join(timeout=1.0)  # Brief join to allow interruption
    except KeyboardInterrupt:
        logger.info("Stopped by user")
        sniffer.stop()
    except Exception as e:
        logger.error(f"Sniffer error: {e}")
        sniffer.stop()
    finally:
        print("[+] Sniffer stopped")
        logger.info("Sniffer stopped gracefully")
        # Summarize ARP history
        for ip, history in arp_history.items():
            logger.info(f"Summary for IP {ip}: {[(mac, time.ctime(ts)) for mac, ts in history]}")

if __name__ == "__main__":
    interface = "Intel(R) Wireless-AC 9560 160MHz"
    sniff(interface)