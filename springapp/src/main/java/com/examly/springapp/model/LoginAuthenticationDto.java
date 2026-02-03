package com.examly.springapp.model;

public class LoginAuthenticationDto {
   private String token;
   private String username;
   private String userRole;
   private int userId;

   
   public LoginAuthenticationDto() {
}
   public LoginAuthenticationDto(String token, String username, String userRole, int userId) {
    this.token = token;
    this.username = username;
    this.userRole = userRole;
    this.userId = userId;
    
}
   public String getToken() {
    return token;
   }
   public void setToken(String token) {
    this.token = token;
   }
   public String getUsername() {
    return username;
   }
   public void setUsername(String username) {
    this.username = username;
   }
   public String getUserRole() {
    return userRole;
   }
   public void setUserRole(String userRole) {
    this.userRole = userRole;
   }
   public int getUserId() {
    return userId;
   }
   public void setUserId(int userId) {
    this.userId = userId;
   }

}
