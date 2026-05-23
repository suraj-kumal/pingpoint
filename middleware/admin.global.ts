export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith("/admin")) return;

  const { loggedIn } = useUserSession();

  if (to.path === "/admin/login") {
    if (loggedIn.value) {
      return navigateTo("/admin/dashboard");
    }
    return;
  }

  if (!loggedIn.value) {
    return navigateTo("/admin/login");
  }
});
