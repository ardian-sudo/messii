import socket

HOST = '127.0.0.1'  # Alamat IP lokal
PORT = 65432        # Port bebas di atas 1024

server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind((HOST, PORT))
server_socket.listen()

print(f"Server berjalan di {HOST}:{PORT}")
print("Menunggu koneksi dari client...")

conn, addr = server_socket.accept()
print(f"Terhubung dengan client {addr}")

while True:
    data = conn.recv(1024).decode('utf-8')
    if not data:
        break
    print(f"Pesan dari client: {data}")

    # Kirim balasan ke client
    balasan = "Pesan diterima oleh server."
    conn.sendall(balasan.encode('utf-8'))

conn.close()
print("Koneksi ditutup.")
