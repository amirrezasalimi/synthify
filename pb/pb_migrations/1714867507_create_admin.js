/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const admin = new Admin()

  admin.email = "backend@gmail.com"
  admin.setPassword("1234567890");

  return Dao(db).saveAdmin(admin)
}, (db) => {
  const dao = new Dao(db)

  const admin = dao.findAdminByEmail("backend@gmail.com")

  return dao.deleteAdmin(admin)
})