package com.example.demo.service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.ReqRes;
import com.example.demo.entity.OurUsers;
import com.example.demo.repository.UsersRepo;

@Service
public class UserManagementService {
	@Autowired
	private UsersRepo usersRepo;
	
	@Autowired
	private JWTUtils jwtUtils;
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	public ReqRes register(ReqRes registrationRequest) {
		ReqRes reqRes = new ReqRes();
		
		try {
			OurUsers ourUser = new OurUsers();
			ourUser.setEmail(registrationRequest.getEmail());
			ourUser.setCity(registrationRequest.getCity());
			ourUser.setRole(registrationRequest.getRole());
			ourUser.setName(registrationRequest.getName());
			ourUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
			OurUsers ourUsersResult = usersRepo.save(ourUser);
			
			if(ourUsersResult.getId() > 0) {
				reqRes.setOurUsers(ourUsersResult);
				reqRes.setMessage("User saved successfully.");
				reqRes.setStatusCode(200);
			}
			
		} catch (Exception e) {
			reqRes.setStatusCode(500);
			reqRes.setError(e.getMessage());
		}
		
		return reqRes;
	}
	
	public ReqRes login(ReqRes loginRequest) {
		ReqRes response = new ReqRes();
		try {
			authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), 
						loginRequest.getPassword()));
			var user = usersRepo.findByEmail(loginRequest.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));
			var jwt = jwtUtils.generateToken(user);
			var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);
			response.setStatusCode(200);
			response.setToken(jwt);
			response.setRefreshToken(refreshToken);
			response.setExpirationTime("24Hrs");
			response.setMessage("Successfully logged in.");
			
		} catch(Exception e) {
			response.setStatusCode(500);
			response .setError(e.getMessage());
		}
		
		return response;
	}
	
	public ReqRes refreshToken(ReqRes refreshTokenRequest) {
		ReqRes response = new ReqRes();
		try {
			String ourEmail = jwtUtils.extractUsername(refreshTokenRequest.getToken());
			OurUsers users = usersRepo.findByEmail(ourEmail).orElseThrow(() -> new RuntimeException("User not found"));
			if (jwtUtils.isTokenValid(refreshTokenRequest.getToken(), users)) {
				var jwt = jwtUtils.generateToken(users);
				response.setStatusCode(200);
				response.setToken(jwt);
				response.setRefreshToken(refreshTokenRequest.getToken());
				response.setExpirationTime("24Hrs");
				response.setMessage("Successfully logged in.");
			}
			response.setStatusCode(200);
			
			return response;
			
		} catch(Exception e) {
			response.setStatusCode(500);
			response .setError(e.getMessage());
			
			return response;
		}
	}
	
	public ReqRes getAllUsers() {
		ReqRes reqRes = new ReqRes();
		
		try {
			List<OurUsers> result = usersRepo.findAll();
			if(!result.isEmpty()) {
				reqRes.setOurUsersList(result);
				reqRes.setStatusCode(200);
				reqRes.setMessage("Successful.");
			} else {
				reqRes.setStatusCode(404);
				reqRes.setMessage("No users found.");
			}
			
		} catch (Exception e) {
			reqRes.setStatusCode(500);
			reqRes.setMessage("Error occured: " + e.getMessage());
			
			return reqRes;
		}
	}
	
	public ReqRes getUsersById(Integer id) {
		ReqRes reqRes = new ReqRes();
		
		try {
			OurUsers usersById = usersRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found."));
			reqRes.setOurUsers(usersById);
			reqRes.setStatusCode(200);
			reqRes.setMessage("Users with id: " + id + " found successfully.");
			
		} catch (Exception e) {
			reqRes.setStatusCode(500);
			reqRes.setMessage("Error occured: " + e.getMessage());
		}
		
		return reqRes;
	}
	
	public ReqRes deleteUser(Integer userId) {
		ReqRes reqRes = new ReqRes();
		
		try {
			Optional<OurUsers> userOptional = usersRepo.findById(userId);
			if(userOptional.isPresent()) {
				usersRepo.deleteById(userId);
				reqRes.setStatusCode(200);
				reqRes.setMessage("User deleted successfully.");
			} else {
				reqRes.setStatusCode(404);
				reqRes.setMessage("User not found for   deletion.");
			}			
			
		} catch (Exception e) {
			reqRes.setStatusCode(500);
			reqRes.setMessage("Error occured while deleting user: " + e.getMessage());
		}
		
		return reqRes;
	}
	
	public ReqRes updateUser(Integer userId, OurUsers updatedUser) {
		ReqRes reqRes = new ReqRes();
		
		try {
			Optional<OurUsers> userOptional = usersRepo.findById(userId);
			if (userOptional.isPresent()) {
				OurUsers existingUser = userOptional.get();
				existingUser.setEmail(updatedUser.getEmail());
				existingUser.setName(updatedUser.getName());
				existingUser.setCity(updatedUser.getCity());
				existingUser.setRole(updatedUser.getRole());
				
				if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
					existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
				}
				
				OurUsers savedUser = usersRepo.save(existingUser);
				reqRes.setOurUsers(savedUser);
				reqRes.setStatusCode(200);
				reqRes.setMessage("User updated successfully.");
				
			} else {
				reqRes.setStatusCode(404);
				reqRes.setMessage("User not found for update.");
			}
			
		} catch (Exception e) {
			reqRes.setStatusCode(500);
			reqRes.setError("Error occured while updating user: " + e.getMessage());
		}
		
		return reqRes;
	}
	
	public ReqRes getMyInfo(String email) {
		ReqRes reqRes = new ReqRes();
		
		try {
			Optional<OurUsers> userOptional = usersRepo.findByEmail(email);
			if (userOptional.isPresent()) {
				reqRes.setOurUsers(userOptional.get());
				reqRes.setStatusCode(200);
				reqRes.setMessage("Successful.");
				
			} else {
				reqRes.setStatusCode(404);
				reqRes.setMessage("User not found for update");
			}
			
		} catch (Exception e) {
			reqRes.setStatusCode(500);
			reqRes.setError("Error occured while updating user: " + e.getMessage());
		}
		
		return reqRes;
	}
}
