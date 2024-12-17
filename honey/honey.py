#!/usr/bin/env python3
import socket
import sys
import threading
import paramiko
import time

HOST_KEY = paramiko.RSAKey(filename='server.key')
SSH_PORT = 22
LOGFILE = 'logins.txt'  
LOGFILE_LOCK = threading.Lock()
ATTEMPTS_LIMIT = 10  
TIME_WINDOW = 30  

connection_attempts = {}  
lock = threading.Lock()  

class SSHServerHandler(paramiko.ServerInterface):
    def __init__(self, client_addr):
        self.event = threading.Event()
        self.client_addr = client_addr

    def check_auth_password(self, username, password):
        with LOGFILE_LOCK:
            try:
                timestamp = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime())
                client_ip = self.client_addr[0]  # Dirección IP del cliente
                log_entry = f"{timestamp} | {client_ip} | {username}:{password}\n"
                print(f"New login attempt: {log_entry.strip()}")
                with open(LOGFILE, "a") as logfile_handle:
                    logfile_handle.write(log_entry)
            except IOError as e:
                print(f"ERROR: Unable to write to log file: {e}")
        return paramiko.AUTH_FAILED

    def get_allowed_auths(self, username):
        return 'password'

def handle_connection(client, client_addr):
    try:
        with lock:
            current_time = time.time()
            ip = client_addr[0]

            if ip not in connection_attempts:
                connection_attempts[ip] = {"count": 0, "start_time": current_time}

            attempts = connection_attempts[ip]
            if current_time - attempts["start_time"] > TIME_WINDOW:
                attempts["count"] = 0
                attempts["start_time"] = current_time

            attempts["count"] += 1

            if attempts["count"] > ATTEMPTS_LIMIT:
                with LOGFILE_LOCK:
                    try:
                        with open(LOGFILE, "a") as logfile_handle:
                            timestamp = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime())
                            logfile_handle.write(f"{timestamp} | Blocked IP: {ip}\n")
                        print(f"Blocked IP: {ip}")
                    except IOError as e:
                        print(f"ERROR: Unable to write to log file: {e}")
                client.close()
                return

        transport = paramiko.Transport(client)
        transport.add_server_key(HOST_KEY)

        server_handler = SSHServerHandler(client_addr)
        transport.start_server(server=server_handler)

        channel = transport.accept(10)
        if channel:
            channel.close()
    except Exception as e:
        print(f"ERROR in handling connection: {e}")
    finally:
        client.close()

def clear_ip(ip):
    with lock:
        if ip in connection_attempts:
            del connection_attempts[ip]
            print(f"IP {ip} has been manually cleared.")

def main():
    try:
        server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server_socket.bind(('', SSH_PORT))
        server_socket.listen(100)

        paramiko.util.log_to_file('paramiko.log')

        print(f"Server running on port {SSH_PORT}...")

        while True:
            try:
                client_socket, client_addr = server_socket.accept()
                print(f"Connection from {client_addr}")
                threading.Thread(target=handle_connection, args=(client_socket, client_addr), daemon=True).start()
            except Exception as e:
                print("ERROR: Client handling")
                print(e)

    except Exception as e:
        print("ERROR: Failed to create socket")
        print(e)
        sys.exit(1)

if __name__ == "__main__":
    main()
