// Ambient declarations for PlayFab SDK global namespaces.
// The installed playfab-sdk v2+ exports modules but not the legacy global
// `*Models` / `*Module` namespaces the app source references. These stubs
// satisfy type-checking without altering runtime behavior.
export {};
declare global {
  namespace PlayFabClientModels {}
  namespace PlayFabClientModule {}
  namespace PlayFabServerModels {}
  namespace PlayFabServerModule {}
  namespace PlayFabAdminModels {}
  namespace PlayFabAdminModule {}
  namespace PlayFabCloudScriptModels {}
  namespace PlayFabCloudScriptModule {}
  namespace PlayFabAuthenticationModels {}
  namespace PlayFabDataModels {}
  namespace PlayFabEconomyModels {}
  namespace PlayFabProfilesModels {}
  namespace PlayFabGroupsModels {}
  namespace PlayFabModule {}
}
// trig 29627534863 rerun
