// Ambient declarations for PlayFab SDK global namespaces.
// The installed playfab-sdk v2+ exports modules but not the legacy global
// `*Models` / `*Module` namespaces the app source references. These stubs
// satisfy type-checking without altering runtime behavior.
declare namespace PlayFabClientModels {}
declare namespace PlayFabClientModule {}
declare namespace PlayFabServerModels {}
declare namespace PlayFabServerModule {}
declare namespace PlayFabAdminModels {}
declare namespace PlayFabAdminModule {}
declare namespace PlayFabCloudScriptModels {}
declare namespace PlayFabCloudScriptModule {}
declare namespace PlayFabAuthenticationModels {}
declare namespace PlayFabDataModels {}
declare namespace PlayFabEconomyModels {}
declare namespace PlayFabProfilesModels {}
declare namespace PlayFabGroupsModels {}
declare namespace PlayFabModule {}
