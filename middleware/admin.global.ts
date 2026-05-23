export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith("/admin")) return;

  if (to.path === "/admin/login") return;

  const { loggedIn } = useUserSession();

  if (!loggedIn.value) {
    return navigateTo("/admin/login");
  }
});
