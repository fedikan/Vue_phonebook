import Vue from "vue"
import Router from "vue-router"
import Contact from "../Contact"
import PhoneBook from "../PhoneBook"

Vue.use(Router)

let router = new Router({
  
  routes: [
    {
      path: "/",
      name: "phone_book",
      component: PhoneBook,
      props: true
    },
    {
      path: "/contact/:index",
      name: "contact",
      component: Contact,
      props: true
    }
  ]
})

export default router
