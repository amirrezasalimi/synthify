/// <reference path="../pb_data/types.d.ts" />
const defaultEmail = "backend@gmail.com";
migrate(
  (db) => {
    try {
      const admin = new Admin();
      admin.email = defaultEmail;
      admin.setPassword("1234567890");
      return Dao(db).saveAdmin(admin);
    } catch (e) {
      console.log(e);
    }
  },
  (db) => {
    const dao = new Dao(db);

    const admin = dao.findAdminByEmail(defaultEmail);

    return dao.deleteAdmin(admin);
  }
);
