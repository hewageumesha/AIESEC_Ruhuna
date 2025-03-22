-- Create Database
CREATE DATABASE aiesec_in_ruhuna;

-- Use Database
USE aiesec_in_ruhuna;

-- Table: User
CREATE TABLE User (
    First_Name VARCHAR(100) NOT NULL,
    Last_Name VARCHAR(100) NOT NULL,
    Email VARCHAR(150) UNIQUE NOT NULL,
    AIESEC_Email VARCHAR(150) UNIQUE NOT NULL,
    Phone_Number VARCHAR(20),
    Full_Name VARCHAR(200) GENERATED ALWAYS AS (CONCAT(First_Name, ' ', Last_Name)) STORED, -- Saves space
    Password VARCHAR(255) NOT NULL, -- Store hashed passwords
    Profile_Photo VARCHAR(255),
    Birthday DATE NOT NULL,
    Date_Joined Date NOT NULL,
    Assigned_Team VARCHAR(255) NOT NULL, 
    Status ENUM('Active', 'Inactive') DEFAULT 'Active',  -- Single column for status
    CHECK (Status IN ('Active', 'Inactive')) -- Ensures only valid values
);

-- Table: Role
CREATE TABLE Roles (
    Role_ID INT PRIMARY KEY AUTO_INCREMENT,
    Role_Name VARCHAR(100) NOT NULL
);

-- Table: Function
CREATE TABLE Functions (
    Function_ID INT PRIMARY KEY AUTO_INCREMENT,
    Function_Name VARCHAR(100) NOT NULL
);

-- Table: Local Committee President (LCP)
CREATE TABLE Local_Committee_President (
    LCP_ID INT PRIMARY KEY AUTO_INCREMENT
);

-- Table: Local Committee Vice President (LCVP)
CREATE TABLE Local_Committee_Vice_President (
    LCVP_ID INT PRIMARY KEY AUTO_INCREMENT
);

-- Table: Team Leader
CREATE TABLE Team_Leader (
    TL_ID INT PRIMARY KEY AUTO_INCREMENT
);

-- Table: Member
CREATE TABLE Members (
    M_ID INT PRIMARY KEY AUTO_INCREMENT
);

-- Table: User Role Function
CREATE TABLE User_Role_Function (
    LCP_ID INT NOT NULL,
    LCVP_ID INT NOT NULL,
    TL_ID INT NOT NULL,
    M_ID INT NOT NULL,
    Role_ID INT NOT NULL,
    Function_ID INT NOT NULL,
    FOREIGN KEY (LCP_ID) REFERENCES Local_Committee_President(LCP_ID) ON DELETE CASCADE,
    FOREIGN KEY (LCVP_ID) REFERENCES Local_Committee_Vice_President(LCVP_ID) ON DELETE CASCADE,
    FOREIGN KEY (TL_ID) REFERENCES Team_Leader(TL_ID) ON DELETE CASCADE,
    FOREIGN KEY (M_ID) REFERENCES Members(M_ID) ON DELETE CASCADE,
    FOREIGN KEY (Role_ID) REFERENCES Roles(Role_ID) ON DELETE CASCADE,
    FOREIGN KEY (Function_ID) REFERENCES Functions(Function_ID) ON DELETE CASCADE
);

-- Table: Task
CREATE TABLE Task (
    Task_ID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(200) NOT NULL,
    Descriptions TEXT NOT NULL,
    Status ENUM('Not Started', 'In Progress', 'Completed') DEFAULT 'Not Started',
    Priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    Date ENUM('Start Date', 'End Date') DEFAULT (CURRENT_DATE),
    LCP_ID INT NULL,
    LCVP_ID INT NULL,
    TL_ID INT NULL,
    FOREIGN KEY (LCP_ID) REFERENCES Local_Committee_President(LCP_ID) ON DELETE CASCADE,
    FOREIGN KEY (LCVP_ID) REFERENCES Local_Committee_Vice_President(LCVP_ID) ON DELETE CASCADE,
    FOREIGN KEY (TL_ID) REFERENCES Team_Leader(TL_ID) ON DELETE CASCADE
);

-- Table: Event
CREATE TABLE Event (
    Event_ID INT PRIMARY KEY AUTO_INCREMENT,
    Descriptions TEXT NOT NULL,
    Event_Name VARCHAR(200) NOT NULL,
    Start_Date DATE NOT NULL,
    End_Date DATE NOT NULL,
    Event_Time TIME NOT NULL,
    Location VARCHAR(255) NOT NULL,
    Event_Photo VARCHAR(255) NOT NULL,
    LCP_ID INT NULL,
    LCVP_ID INT NULL,
    TL_ID INT NULL, 
    FOREIGN KEY (LCP_ID) REFERENCES Local_Committee_President(LCP_ID) ON DELETE SET NULL,
    FOREIGN KEY (LCVP_ID) REFERENCES Local_Committee_Vice_President(LCVP_ID) ON DELETE SET NULL,
    FOREIGN KEY (TL_ID) REFERENCES Team_Leader(TL_ID) ON DELETE SET NULL
);

-- Table: Event Gallery
CREATE TABLE Event_Gallery (
    Image_ID INT PRIMARY KEY AUTO_INCREMENT,
    Event_ID INT NOT NULL,
    Image_URL VARCHAR(255),
    LCP_ID INT NULL,
    LCVP_ID INT NULL,
    FOREIGN KEY (LCP_ID) REFERENCES Local_Committee_President(LCP_ID) ON DELETE CASCADE,
    FOREIGN KEY (LCVP_ID) REFERENCES Local_Committee_Vice_President(LCVP_ID) ON DELETE CASCADE,
    FOREIGN KEY (Event_ID) REFERENCES Event(Event_ID) ON DELETE CASCADE
);

-- Table: Birthday Management
CREATE TABLE Birthday_Management (
    Birthday_ID INT PRIMARY KEY AUTO_INCREMENT,
    Flyer_Photo VARCHAR(255) NULL,
    Notification_Status ENUM('Not Sent', 'Sent') DEFAULT 'Not Sent',
    LCP_ID INT NOT NULL,
    LCVP_ID INT NOT NULL,
    TL_ID INT NOT NULL,
    M_ID INT NOT NULL,
    FOREIGN KEY (LCP_ID) REFERENCES Local_Committee_President(LCP_ID) ON DELETE CASCADE,
    FOREIGN KEY (LCVP_ID) REFERENCES Local_Committee_Vice_President(LCVP_ID) ON DELETE CASCADE,
    FOREIGN KEY (TL_ID) REFERENCES Team_Leader(TL_ID) ON DELETE CASCADE,
    FOREIGN KEY (M_ID) REFERENCES Members(M_ID) ON DELETE CASCADE
);

-- Table: Invoice
CREATE TABLE Invoice (
    Invoice_ID INT PRIMARY KEY AUTO_INCREMENT,
    LCP_ID INT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    Payment_Status ENUM('Pending', 'Paid') DEFAULT 'Pending' NOT NULL,
    Invoice_No VARCHAR(50) UNIQUE NOT NULL,
    Date_Recorded DATE DEFAULT (CURRENT_DATE) NOT NULL,
    FOREIGN KEY (LCP_ID) REFERENCES Local_Committee_President(LCP_ID) ON DELETE CASCADE
);

-- Table: Expense
CREATE TABLE Expense (
    Expense_ID INT PRIMARY KEY AUTO_INCREMENT,
    LCP_ID INT NOT NULL,
    LCVP_ID INT NOT NULL,
    Descriptions TEXT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    Payment_Method VARCHAR(25) NOT NULL,
    Category VARCHAR(50) NOT NULL,
    Date DATE DEFAULT (CURRENT_DATE) NOT NULL,
    FOREIGN KEY (LCP_ID) REFERENCES Local_Committee_President(LCP_ID) ON DELETE CASCADE,
    FOREIGN KEY (LCVP_ID) REFERENCES Local_Committee_Vice_President(LCVP_ID) ON DELETE CASCADE
);

-- Table: Announcement Management
CREATE TABLE Announcement_Management (
    Announce_ID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(200) NOT NULL,
    Message TEXT NOT NULL,
    Date_Posted DATE DEFAULT (CURRENT_DATE),
    Status ENUM('Draft', 'Active', 'Expired') DEFAULT 'Draft',
    LCP_ID INT,
    LCVP_ID INT,
    FOREIGN KEY (LCP_ID) REFERENCES Local_Committee_President(LCP_ID) ON DELETE SET NULL,
    FOREIGN KEY (LCVP_ID) REFERENCES Local_Committee_Vice_President(LCVP_ID) ON DELETE SET NULL
);

-- Table: TShirt Order
CREATE TABLE TShirt_Order (
    Order_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Contact_Number VARCHAR(20) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE, 
    Faculty VARCHAR(255) NOT NULL,  
    Academic_Year VARCHAR(50) NOT NULL,  
    TShirt_Size ENUM('S', 'M', 'L', 'XL', 'XXL') NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0), 
    Order_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Automatically records the order time
);
