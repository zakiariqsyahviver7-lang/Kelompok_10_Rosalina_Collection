// 1. INHERITANCE (Pewarisan)
// Class Induk merepresentasikan Actor "User" pada diagram Login
class User {
    // 2. ENCAPSULATION (Pengkapsulan)
    // Menggunakan tanda '#' membuat variabel menjadi private (tidak bisa dibaca dari luar class)
    #username;
    #password;
    #role;

    constructor(username, password, role) {
        this.#username = username;
        this.#password = password;
        this.#role = role;
    }

    // Getter untuk membaca data private dari luar
    getUsername() { return this.#username; }
    getPassword() { return this.#password; }
    getRole() { return this.#role; }
}

// Class Turunan merepresentasikan Actor "Admin" atau "Owner" pada diagram
class Admin extends User {
    constructor(username, password) {
        super(username, password, "Admin"); // Mewarisi sifat User
    }
}

class Owner extends User {
    constructor(username, password) {
        super(username, password, "Owner"); // Mewarisi sifat User
    }
}

// Class ini merepresentasikan object kotak "Database" pada diagram
class Database {
    // Merepresentasikan panah "ambil_data_user()"
    ambil_data_user(username) {
        // Simulasi pencarian data di database
        if (username === "admin123") {
            return new Admin("admin123", "pass123"); // Mengembalikan panah "<<return>>"
        } else if (username === "owner123") {
            return new Owner("owner123", "pass123");
        } else {
            // 3. EXCEPTION HANDLING (Melempar error jika data tidak ada di DB)
            throw new Error("Error: User tidak ditemukan di Database!");
        }
    }
}

// Class ini merepresentasikan object kotak "Login" pada diagram
class LoginController {
    constructor() {
        this.db = new Database();
    }

    // Merepresentasikan panah masuk "Login()"
    prosesLogin(inputUser, inputPass) {
        // 3. EXCEPTION HANDLING (Menangkap dan menangani error agar Node.js tidak crash)
        try {
            // Merepresentasikan panah memutar "Validasi"
            if (!inputUser || !inputPass) {
                throw new Error("Error Validasi: Username dan Password tidak boleh kosong!");
            }

            // Memanggil panah menuju Database
            const userDb = this.db.ambil_data_user(inputUser);

            // Cek kecocokan password
            if (userDb.getPassword() === inputPass) {
                console.log(`<<sukses>> Login berhasil sebagai ${userDb.getRole()}`);
                return true;
            } else {
                console.log("<<Gagal>> Password salah!");
                return false;
            }

        } catch (error) {
            // Menangkap pesan error dari proses validasi atau Database
            console.log(error.message);
            return false; // Merepresentasikan panah balik "<<Gagal>>"
        }
    }
}

// Class ini merepresentasikan object kotak "LoginPage" (Tampilan/UI) pada diagram
class LoginPage {
    static main() {
        const login = new LoginController();
        
        console.log("--- Percobaan Login 1 (Skenario Sukses) ---");
        // Merepresentasikan panah putus-putus "input username & password"
        login.prosesLogin("admin123", "pass123"); 

        console.log("\n--- Percobaan Login 2 (Skenario Gagal/Exception) ---");
        login.prosesLogin("orangasing", "rahasia");
    }
}

// Menjalankan simulasi antarmuka halaman login
LoginPage.main();