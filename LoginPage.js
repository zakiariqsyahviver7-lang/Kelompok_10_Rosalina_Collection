// 1. INHERITANCE (Pewarisan)
class User {
    // 2. ENCAPSULATION (Pengkapsulan)
    #username;
    #password;
    #role;

    constructor(username, password, role) {
        this.#username = username;
        this.#password = password;
        this.#role = role;
    }

    getUsername() { return this.#username; }
    getPassword() { return this.#password; }
    getRole() { return this.#role; }
}

class Admin extends User {
    constructor(username, password) {
        super(username, password, "Admin");
    }
}

class Owner extends User {
    constructor(username, password) {
        super(username, password, "Owner"); //
    }
}

class Database {
    ambil_data_user(username) {
        if (username === "admin123") {
            return new Admin("admin123", "pass123");
        } else if (username === "owner123") {
            return new Owner("owner123", "pass123");
        } else {
            // 3. EXCEPTION HANDLING (Melempar error jika data tidak ada di DB)
            throw new Error("Error: User tidak ditemukan di Database!");
        }
    }
}

class LoginController {
    constructor() {
        this.db = new Database();
    }

    prosesLogin(inputUser, inputPass) {
        // 3. EXCEPTION HANDLING (Menangkap dan menangani error agar Node.js tidak crash)
        try {
            if (!inputUser || !inputPass) {
                throw new Error("Error Validasi: Username dan Password tidak boleh kosong!");
            }

            const userDb = this.db.ambil_data_user(inputUser);

            if (userDb.getPassword() === inputPass) {
                console.log(`<<sukses>> Login berhasil sebagai ${userDb.getRole()}`);
                return true;
            } else {
                console.log("<<Gagal>> Password salah!");
                return false;
            }

        } catch (error) {
            console.log(error.message);
            return false;
        }
    }
}

class LoginPage {
    static main() {
        const login = new LoginController();
        
        console.log("--- Percobaan Login 1 (Skenario Sukses) ---");
        login.prosesLogin("admin123", "pass123"); 

        console.log("\n--- Percobaan Login 2 (Skenario Gagal/Exception) ---");
        login.prosesLogin("orangasing", "rahasia");
    }
}
LoginPage.main();