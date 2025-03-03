/* Sidebar hidden by default */
.sidebar-menu {
  position: fixed;
  left: -250px;
  top: 0;
  width: 250px;
  height: 100%;
  background: #333;
  color: white;
  padding: 15px;
  transition: left 0.3s;
  z-index: 9999; /* above main content */
}

.sidebar-menu.open {
  left: 0; /* slides in */
}

.sidebar-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu ul li {
  margin: 10px 0;
}

.sidebar-menu ul li a {
  color: #fff;
  text-decoration: none;
}

/* The three-striped button */
.menu-toggle {
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  position: fixed; /* so it stays in the corner */
  top: 15px;
  left: 15px;
  z-index: 10000; /* above the sidebar */
  color: #333; /* change color if you want white or something else */
}
