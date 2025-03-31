import scapy.all as scapy
import socket
import logging

# Logging configuration (only logs when run standalone)
logging.basicConfig(level=logging.INFO)

# Function to dynamically fetch the active network interface
def get_active_interface():
    try:
        # Get the default gateway IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))  # Connect to Google's DNS to find local interface
        local_ip = s.getsockname()[0]
        s.close()

        # Get all interfaces from Scapy
        interfaces = scapy.get_if_list()

        # Find the interface associated with the local IP
        for iface in interfaces:
            try:
                addr = scapy.get_if_addr(iface)
                if addr == local_ip:
                    return iface
            except Exception:
                continue

        # Fallback if no match found
        if interfaces:
            return interfaces[0]
        else:
            return None
    except Exception:
        return None

# Optional: For standalone testing with logging
if __name__ == "__main__":
    interface = get_active_interface()
    if interface:
        logging.info(f"Available interfaces: {scapy.get_if_list()}")
        logging.info(f"Active interface found: {interface} (IP: {scapy.get_if_addr(interface)})")
        print(f"Active interface: {interface}")
    else:
        logging.error("No network interfaces found")
        print("No network interfaces available")