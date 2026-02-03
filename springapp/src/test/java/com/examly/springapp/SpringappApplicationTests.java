package com.examly.springapp;
 
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
 
import static org.junit.jupiter.api.Assertions.assertTrue;
 
import java.io.File;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
 
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
 
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class SpringappApplicationTests {
 
    private String usertoken;
    private String admintoken;
 
    @Autowired
    private TestRestTemplate restTemplate;
 
    @Autowired
    private ObjectMapper objectMapper; // To parse JSON responses
 
    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }
 
    @Test
    void backend_testAllFilesExist() {
 
        // List of expected files in the 'controller' folder
        String[] controllerFiles = {
            "src/main/java/com/examly/springapp/controller/AppointmentController.java",
            "src/main/java/com/examly/springapp/controller/FeedbackController.java",
            "src/main/java/com/examly/springapp/controller/UserController.java",
            "src/main/java/com/examly/springapp/controller/VehicleServiceController.java"
        };
 
        // List of expected files in the 'model' folder
        String[] modelFiles = {
            "src/main/java/com/examly/springapp/model/Appointment.java",
            "src/main/java/com/examly/springapp/model/Feedback.java",
            "src/main/java/com/examly/springapp/model/User.java",
            "src/main/java/com/examly/springapp/model/VehicleMaintenance.java"
        };
 
        // List of expected files in the 'repository' folder
        String[] repositoryFiles = {
            "src/main/java/com/examly/springapp/repository/AppointmentRepo.java",
            "src/main/java/com/examly/springapp/repository/FeedbackRepo.java",
            "src/main/java/com/examly/springapp/repository/UserRepo.java",
            "src/main/java/com/examly/springapp/repository/VehicleServiceRepo.java"
        };
 
        // List of expected files in the 'service' folder
        String[] serviceFiles = {
            "src/main/java/com/examly/springapp/service/AppointmentService.java",
            "src/main/java/com/examly/springapp/service/AppointmentServiceImpl.java",
            "src/main/java/com/examly/springapp/service/FeedbackService.java",
            "src/main/java/com/examly/springapp/service/FeedbackServiceImpl.java",
            "src/main/java/com/examly/springapp/service/UserService.java",
            "src/main/java/com/examly/springapp/service/UserServiceImpl.java",
            "src/main/java/com/examly/springapp/service/VehicleService.java",
            "src/main/java/com/examly/springapp/service/VehicleServiceImpl.java"
        };
 
        // Verify Controller files
        for (String filePath : controllerFiles) {
            File file = new File(filePath);
            assertTrue(file.exists() && file.isFile(), "File not found: " + filePath);
        }
 
        // Verify Model files
        for (String filePath : modelFiles) {
            File file = new File(filePath);
            assertTrue(file.exists() && file.isFile(), "File not found: " + filePath);
        }
 
        // Verify Repository files
        for (String filePath : repositoryFiles) {
            File file = new File(filePath);
            assertTrue(file.exists() && file.isFile(), "File not found: " + filePath);
        }
 
        // Verify Service files
        for (String filePath : serviceFiles) {
            File file = new File(filePath);
            assertTrue(file.exists() && file.isFile(), "File not found: " + filePath);
        }
    }
 
    @Test
    void backend_testAllFoldersExist(){
        String[] expectedFolders = {
            "src/main/java/com/examly/springapp/controller",
            "src/main/java/com/examly/springapp/model",
            "src/main/java/com/examly/springapp/repository",
            "src/main/java/com/examly/springapp/service"
        };
 
        for (String folderPath : expectedFolders) {
            File folder = new File(folderPath);
            assertTrue(folder.exists() && folder.isDirectory(), "Folder not found: " + folderPath);
        }
    }
 
    @Test
    @Order(1)
    void backend_testRegisterAdmin() {
        String requestBody = "{\"userId\": 1,\"email\": \"demoadmin@gmail.com\", \"password\": \"admin@1234\", \"username\": \"admin123\", \"userRole\": \"ADMIN\", \"mobileNumber\": \"9876543210\"}";
        ResponseEntity<String> response = restTemplate.postForEntity("/api/register",
                new HttpEntity<>(requestBody, createHeaders()), String.class);
 
        Assertions.assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }
 
    @Test
    @Order(2)
    void backend_testRegisterUser() {
        String requestBody = "{\"userId\": 2,\"email\": \"demouser@gmail.com\", \"password\": \"user@1234\", \"username\": \"user123\", \"userRole\": \"USER\", \"mobileNumber\": \"1122334455\"}";
        ResponseEntity<String> response = restTemplate.postForEntity("/api/register",
                new HttpEntity<>(requestBody, createHeaders()), String.class);
 
        Assertions.assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }
 
    @Test
    @Order(3)
    void backend_testLoginAdmin() throws Exception {
        String requestBody = "{\"username\": \"admin123\", \"password\": \"admin@1234\"}";
 
        ResponseEntity<String> response = restTemplate.postForEntity("/api/login",
                new HttpEntity<>(requestBody, createHeaders()), String.class);
 
    // Check if response body is null
    Assertions.assertNotNull(response.getBody(), "Response body is null!");
 
        JsonNode responseBody = objectMapper.readTree(response.getBody());
        String token = responseBody.get("token").asText();
        admintoken = token;
 
        Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
        Assertions.assertNotNull(token);
    }
 
    @Test
    @Order(4)
    void backend_testLoginUser() throws Exception {
        String requestBody = "{\"username\": \"user123\", \"password\": \"user@1234\"}";
 
        ResponseEntity<String> response = restTemplate.postForEntity("/api/login",
                new HttpEntity<>(requestBody, createHeaders()), String.class);
 
        JsonNode responseBody = objectMapper.readTree(response.getBody());
        String token = responseBody.get("token").asText();
        usertoken = token;
 
        Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
        Assertions.assertNotNull(token);
    }
 
    @Test
    @Order(5)
    void backend_testAddVehicleMaintenanceServiceWithRoleValidation() throws Exception {
        // Ensure tokens are available
        Assertions.assertNotNull(admintoken, "Admin token should not be null");
        Assertions.assertNotNull(usertoken, "User token should not be null");
   
        String requestBody = "{"
            + "\"serviceId\": " + 1 + ","
            + "\"serviceName\": \"Oil Change\","
            + "\"servicePrice\": " + 1500 + ","
            + "\"typeOfVehicle\": \"Sedan\""
            + "}";
   
        // Test with Admin token (Expecting 201 Created)
        HttpHeaders adminHeaders = createHeaders();
        adminHeaders.set("Authorization", "Bearer " + admintoken);
        HttpEntity<String> adminRequest = new HttpEntity<>(requestBody, adminHeaders);
   
        ResponseEntity<String> adminResponse = restTemplate.exchange("/api/services", HttpMethod.POST, adminRequest, String.class);
        JsonNode responseBody = objectMapper.readTree(adminResponse.getBody());
   
        System.out.println(adminResponse.getStatusCode() + " Status code for Admin adding service");
        Assertions.assertEquals(HttpStatus.CREATED, adminResponse.getStatusCode());
        Assertions.assertEquals(1500, responseBody.get("servicePrice").asInt());
        Assertions.assertEquals("Sedan", responseBody.get("typeOfVehicle").asText());
   
        HttpHeaders userHeaders = createHeaders();
        userHeaders.set("Authorization", "Bearer " + usertoken);
        HttpEntity<String> userRequest = new HttpEntity<>(requestBody, userHeaders);
   
        ResponseEntity<String> userResponse = restTemplate.exchange("/api/services", HttpMethod.POST, userRequest, String.class);
   
        System.out.println(userResponse.getStatusCode() + " Status code for User trying to add service");
        Assertions.assertEquals(HttpStatus.FORBIDDEN, userResponse.getStatusCode());
    }
 
 
@Test
@Order(6)
void backend_testGetVehicleMaintenanceServiceByIdWithRoleValidation() throws Exception {
    // Ensure tokens are available
    Assertions.assertNotNull(admintoken, "Admin token should not be null");
    Assertions.assertNotNull(usertoken, "User token should not be null");
 
    Long serviceId = 1L;
    String url = "/api/services/" + serviceId;
 
    // Test with Admin token (Expecting 200 OK)
    HttpHeaders adminHeaders = createHeaders();
    adminHeaders.set("Authorization", "Bearer " + admintoken);
    HttpEntity<Void> adminRequest = new HttpEntity<>(adminHeaders);
 
    ResponseEntity<String> adminResponse = restTemplate.exchange(url, HttpMethod.GET, adminRequest, String.class);
 
    System.out.println(adminResponse.getStatusCode() + " Status code for Admin retrieving service");
    Assertions.assertEquals(HttpStatus.OK, adminResponse.getStatusCode());
 
    // Parse and validate JSON response
    ObjectMapper objectMapper = new ObjectMapper();
    JsonNode responseBody = objectMapper.readTree(adminResponse.getBody());
 
    Assertions.assertEquals(1, responseBody.get("id").asInt());
    Assertions.assertEquals("Oil Change", responseBody.get("serviceName").asText());
    Assertions.assertEquals(1500, responseBody.get("servicePrice").asInt());
    Assertions.assertEquals("Sedan", responseBody.get("typeOfVehicle").asText());
 
    System.out.println("Admin Response JSON: " + responseBody.toString());
 
    // Test with User token (Expecting 403 Forbidden)
    HttpHeaders userHeaders = createHeaders();
    userHeaders.set("Authorization", "Bearer " + usertoken);
    HttpEntity<Void> userRequest = new HttpEntity<>(userHeaders);
 
    ResponseEntity<String> userResponse = restTemplate.exchange(url, HttpMethod.GET, userRequest, String.class);
 
    System.out.println(userResponse.getStatusCode() + " Status code for User trying to retrieve service");
    Assertions.assertEquals(HttpStatus.OK, userResponse.getStatusCode());
}
 
@Test
@Order(7)
void backend_testGetVehicleMaintenanceServiceByNameWithRoleValidation() throws Exception {
    // Ensure tokens are available
    Assertions.assertNotNull(admintoken, "Admin token should not be null");
    Assertions.assertNotNull(usertoken, "User token should not be null");
 
    String serviceName = "Oil Change";
    String url = "/api/services/service?serviceName=" + URLEncoder.encode(serviceName, StandardCharsets.UTF_8);
 
    // Test GET with Admin token (Expecting 200 OK with service details)
    HttpHeaders adminHeaders = createHeaders();
    adminHeaders.set("Authorization", "Bearer " + admintoken);
    HttpEntity<String> adminRequest = new HttpEntity<>(adminHeaders);
 
    ResponseEntity<String> adminResponse = restTemplate.exchange(url, HttpMethod.GET, adminRequest, String.class);
    JsonNode responseBody = objectMapper.readTree(adminResponse.getBody());
 
    System.out.println(adminResponse.getStatusCode() + " Status code for Admin getting service by name");
    Assertions.assertEquals(HttpStatus.OK, adminResponse.getStatusCode());
    Assertions.assertEquals(serviceName, responseBody.get(0).get("serviceName").asText()); // Verify service name
 
    // Test GET with User token (Expecting 200 OK with service details)
    HttpHeaders userHeaders = createHeaders();
    userHeaders.set("Authorization", "Bearer " + usertoken);
    HttpEntity<String> userRequest = new HttpEntity<>(userHeaders);
 
    ResponseEntity<String> userResponse = restTemplate.exchange(url, HttpMethod.GET, userRequest, String.class);
    JsonNode userResponseBody = objectMapper.readTree(userResponse.getBody());
 
    System.out.println(userResponse.getStatusCode() + " Status code for User getting service by name");
    Assertions.assertEquals(HttpStatus.OK, userResponse.getStatusCode());
    Assertions.assertEquals(serviceName, userResponseBody.get(0).get("serviceName").asText());
}
 
 
@Test
@Order(8)
void backend_testGetAllVehicleMaintenanceServicesWithRoleValidation() throws Exception {
    // Ensure tokens are available
    Assertions.assertNotNull(admintoken, "Admin token should not be null");
    Assertions.assertNotNull(usertoken, "User token should not be null");
 
    // Test GET with Admin token (Expecting 200 OK with a list of services)
    HttpHeaders adminHeaders = createHeaders();
    adminHeaders.set("Authorization", "Bearer " + admintoken);
    HttpEntity<String> adminRequest = new HttpEntity<>(adminHeaders);
 
    ResponseEntity<String> adminResponse = restTemplate.exchange("/api/services", HttpMethod.GET, adminRequest, String.class);
    JsonNode responseBody = objectMapper.readTree(adminResponse.getBody());
 
    System.out.println(adminResponse.getStatusCode() + " Status code for Admin getting all services");
    Assertions.assertEquals(HttpStatus.OK, adminResponse.getStatusCode());
    Assertions.assertTrue(responseBody.isArray()); // Verify response is an array
 
    // Test GET with User token (Expecting 200 OK with a list of services)
    HttpHeaders userHeaders = createHeaders();
    userHeaders.set("Authorization", "Bearer " + usertoken);
    HttpEntity<String> userRequest = new HttpEntity<>(userHeaders);
 
    ResponseEntity<String> userResponse = restTemplate.exchange("/api/services", HttpMethod.GET, userRequest, String.class);
    JsonNode userResponseBody = objectMapper.readTree(userResponse.getBody());
 
    System.out.println(userResponse.getStatusCode() + " Status code for User getting all services");
    Assertions.assertEquals(HttpStatus.OK, userResponse.getStatusCode());
    Assertions.assertTrue(userResponseBody.isArray()); // Verify response is an array
}
 
@Test
@Order(9)
void backend_testUpdateVehicleMaintenanceServiceWithRoleValidation() throws Exception {
    // Ensure tokens are available
    Assertions.assertNotNull(admintoken, "Admin token should not be null");
    Assertions.assertNotNull(usertoken, "User token should not be null");
 
    Long serviceId = 1L;
    String url = "/api/services/" + serviceId;
 
    String updateRequestBody = "{"
        + "\"serviceId\": " + serviceId + ","
        + "\"serviceName\": \"Full Service\","
        + "\"servicePrice\": " + 2000 + ","
        + "\"typeOfVehicle\": \"SUV\""
        + "}";
 
    // Test with Admin token (Expecting 200 OK)
    HttpHeaders adminHeaders = createHeaders();
    adminHeaders.set("Authorization", "Bearer " + admintoken);
    HttpEntity<String> adminRequest = new HttpEntity<>(updateRequestBody, adminHeaders);
 
    ResponseEntity<String> adminResponse = restTemplate.exchange(url, HttpMethod.PUT, adminRequest, String.class);
   
    System.out.println(adminResponse.getStatusCode() + " Status code for Admin updating service");
    Assertions.assertEquals(HttpStatus.OK, adminResponse.getStatusCode());
 
    JsonNode responseBody = objectMapper.readTree(adminResponse.getBody());
 
    Assertions.assertEquals(serviceId, responseBody.get("id").asLong());
    Assertions.assertEquals("Full Service", responseBody.get("serviceName").asText());
    Assertions.assertEquals(2000, responseBody.get("servicePrice").asInt());
    Assertions.assertEquals("SUV", responseBody.get("typeOfVehicle").asText());
 
    System.out.println("Admin Update Response JSON: " + responseBody.toString());
 
    // Test with User token (Expecting 403 Forbidden)
    HttpHeaders userHeaders = createHeaders();
    userHeaders.set("Authorization", "Bearer " + usertoken);
    HttpEntity<String> userRequest = new HttpEntity<>(updateRequestBody, userHeaders);
 
    ResponseEntity<String> userResponse = restTemplate.exchange(url, HttpMethod.PUT, userRequest, String.class);
 
    System.out.println(userResponse.getStatusCode() + " Status code for User trying to update service");
    Assertions.assertEquals(HttpStatus.FORBIDDEN, userResponse.getStatusCode());
}
 
 
 
 
@Test
    @Order(10)
    void backend_testAddAppointmentWithRoleValidation() throws Exception {
        Assertions.assertNotNull(admintoken, "Admin token should not be null");
        Assertions.assertNotNull(usertoken, "User token should not be null");
 
        String requestBody = "{"
            + "\"appointmentId\": 1,"
            + "\"appointmentDate\": \"2025-03-10\","
            + "\"location\": \"New York\","
            + "\"status\": \"Pending\","
            + "\"user\": {\"userId\": 2},"
            + "\"service\": {\"serviceId\": 1}"
            + "}";
 
        HttpHeaders userHeaders = createHeaders();
        userHeaders.set("Authorization", "Bearer " + usertoken);
        HttpEntity<String> userRequest = new HttpEntity<>(requestBody, userHeaders);
 
        ResponseEntity<String> userResponse = restTemplate.exchange("/api/appointment", HttpMethod.POST, userRequest, String.class);
 
        JsonNode responseBody = objectMapper.readTree(userResponse.getBody());
 
        Assertions.assertEquals(HttpStatus.CREATED, userResponse.getStatusCode());
        Assertions.assertEquals("New York", responseBody.get("location").asText());
        Assertions.assertEquals("Pending", responseBody.get("status").asText());
 
        HttpHeaders adminHeaders = createHeaders();
        adminHeaders.set("Authorization", "Bearer " + admintoken);
        HttpEntity<String> adminRequest = new HttpEntity<>(requestBody, adminHeaders);
 
        ResponseEntity<String> adminResponse = restTemplate.exchange("/api/appointment", HttpMethod.POST, adminRequest, String.class);
        Assertions.assertEquals(HttpStatus.FORBIDDEN, adminResponse.getStatusCode());
    }
 
 
    @Test
    @Order(11)
    void backend_testGetAppointmentsByUserId() throws Exception {
        Assertions.assertNotNull(admintoken, "Admin token should not be null");
        Assertions.assertNotNull(usertoken, "User token should not be null");
 
        Long userId = 2L;
        String url = "/api/appointment/" + userId;
 
        HttpHeaders headers = createHeaders();
        headers.set("Authorization", "Bearer " + usertoken);
        HttpEntity<Void> request = new HttpEntity<>(headers);
 
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);
        Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
 
        JsonNode responseBody = objectMapper.readTree(response.getBody());
    Assertions.assertTrue(responseBody.isArray(), "Response should be an array");
 
    boolean hasPendingInLA = false;
    // Additional JSON structure validation
    for (JsonNode appointment : responseBody) {
        System.out.println(appointment);
        if (appointment.has("status") && appointment.has("location")) {
            if ("Pending".equals(appointment.get("status").asText()) &&
                "New York".equals(appointment.get("location").asText())) {
                hasPendingInLA = true;
                break; // No need to continue checking once we find a match
            }
        }
    }
 
    Assertions.assertTrue(hasPendingInLA, "At least one appointment should have status 'Pending' and location 'Los Angeles'");
    }
 
   
    @Test
    @Order(12)
    void backend_testUpdateAppointmentWithRoleValidation() throws Exception {
        Assertions.assertNotNull(admintoken, "Admin token should not be null");
        Assertions.assertNotNull(usertoken, "User token should not be null");
 
        Long appointmentId = 1L;
        String url = "/api/appointment/" + appointmentId;
 
        String updateRequestBody = "{"
            + "\"appointmentId\": " + appointmentId + ","
            + "\"status\": \"Approved\""
            + "}";
 
        HttpHeaders adminHeaders = createHeaders();
        adminHeaders.set("Authorization", "Bearer " + admintoken);
        HttpEntity<String> adminRequest = new HttpEntity<>(updateRequestBody, adminHeaders);
 
        ResponseEntity<String> adminResponse = restTemplate.exchange(url, HttpMethod.PUT, adminRequest, String.class);
        Assertions.assertEquals(HttpStatus.OK, adminResponse.getStatusCode());
 
        JsonNode responseBody = objectMapper.readTree(adminResponse.getBody());
        Assertions.assertEquals("Approved", responseBody.get("status").asText());
 
        HttpHeaders userHeaders = createHeaders();
        userHeaders.set("Authorization", "Bearer " + usertoken);
        HttpEntity<String> userRequest = new HttpEntity<>(updateRequestBody, userHeaders);
 
        ResponseEntity<String> userResponse = restTemplate.exchange(url, HttpMethod.PUT, userRequest, String.class);
        Assertions.assertEquals(HttpStatus.FORBIDDEN, userResponse.getStatusCode());
    }
 
    @Test
    @Order(13)
    void backend_testGetAllAppointments() throws Exception {
        Assertions.assertNotNull(admintoken, "Admin token should not be null");
 
        HttpHeaders headers = createHeaders();
        headers.set("Authorization", "Bearer " + admintoken);
        HttpEntity<Void> request = new HttpEntity<>(headers);
 
        ResponseEntity<String> response = restTemplate.exchange("/api/appointment", HttpMethod.GET, request, String.class);
        Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
 
        JsonNode responseBody = objectMapper.readTree(response.getBody());
    Assertions.assertTrue(responseBody.isArray(), "Response should be an array");
 
    boolean hasPendingInLA = false;
 
    // Check if at least one appointment has "Pending" status and "Los Angeles" location
    for (JsonNode appointment : responseBody) {
        if (appointment.has("status") && appointment.has("location")) {
            if ("Approved".equals(appointment.get("status").asText())) {
                hasPendingInLA = true;
                break; // No need to continue checking once we find a match
            }
        }
    }
    Assertions.assertTrue(hasPendingInLA, "At least one appointment should have status 'Pending' and location 'Los Angeles'");
    }
 
    @Test
@Order(14)
void backend_testAddFeedbackWithRoleValidation() throws Exception {
    // Ensure tokens are available
    Assertions.assertNotNull(admintoken, "Admin token should not be null");
    Assertions.assertNotNull(usertoken, "User token should not be null");
 
    String requestBody = "{"
        + "\"feedbackId\": 1,"
        + "\"message\": \"Great service!\","
        + "\"rating\": 5,"
        + "\"user\": { \"userId\": 2 }"
        + "}";
 
    // Test with User token (Expecting 201 Created)
    HttpHeaders userHeaders = createHeaders();
    userHeaders.set("Authorization", "Bearer " + usertoken);
    HttpEntity<String> userRequest = new HttpEntity<>(requestBody, userHeaders);
 
    ResponseEntity<String> userResponse = restTemplate.exchange("/api/feedback", HttpMethod.POST, userRequest, String.class);
    JsonNode responseBody = objectMapper.readTree(userResponse.getBody());
 
    System.out.println(userResponse.getStatusCode() + " Status code for User adding feedback");
    Assertions.assertEquals(HttpStatus.CREATED, userResponse.getStatusCode());
    Assertions.assertEquals("Great service!", responseBody.get("message").asText());
    Assertions.assertEquals(5, responseBody.get("rating").asInt());
 
    // Test with Admin token (Expecting 403 Forbidden)
    HttpHeaders adminHeaders = createHeaders();
    adminHeaders.set("Authorization", "Bearer " + admintoken);
    HttpEntity<String> adminRequest = new HttpEntity<>(requestBody, adminHeaders);
 
    ResponseEntity<String> adminResponse = restTemplate.exchange("/api/feedback", HttpMethod.POST, adminRequest, String.class);
    System.out.println(adminResponse.getStatusCode() + " Status code for Admin trying to add feedback");
    Assertions.assertEquals(HttpStatus.FORBIDDEN, adminResponse.getStatusCode());
}
 
@Test
@Order(15)
void backend_testGetFeedbackByUserIdWithRoleValidation() throws Exception {
    Assertions.assertNotNull(admintoken, "Admin token should not be null");
    Assertions.assertNotNull(usertoken, "User token should not be null");
 
    String url = "/api/feedback/user/2";
 
    // User should be able to view their own feedback
    HttpHeaders userHeaders = createHeaders();
    userHeaders.set("Authorization", "Bearer " + usertoken);
    HttpEntity<String> userRequest = new HttpEntity<>(userHeaders);
 
    ResponseEntity<String> userResponse = restTemplate.exchange(url, HttpMethod.GET, userRequest, String.class);
    Assertions.assertEquals(HttpStatus.OK, userResponse.getStatusCode());
 
    // Admin should also be able to view feedback by user ID
    HttpHeaders adminHeaders = createHeaders();
    adminHeaders.set("Authorization", "Bearer " + admintoken);
    HttpEntity<String> adminRequest = new HttpEntity<>(adminHeaders);
 
    ResponseEntity<String> adminResponse = restTemplate.exchange(url, HttpMethod.GET, adminRequest, String.class);
    Assertions.assertEquals(HttpStatus.OK, adminResponse.getStatusCode());
}
 
}