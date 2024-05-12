-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2024-04-28 02:24:49.275
 
create database fairjob;
use fairjob;
-- tables
-- Table: ApplicationForm
CREATE TABLE ApplicationForm (
    ApplicationID int  NOT NULL AUTO_INCREMENT,
    submissionDate datetime  NOT NULL,
    Jobs_OfferID int  NOT NULL,
    CONSTRAINT ApplicationForm_pk PRIMARY KEY (ApplicationID)
)AUTO_INCREMENT=1;

-- Table: ApplyFor
CREATE TABLE ApplyFor (
    Student_StdID int  NOT NULL,
    Jobs_OfferID int  NOT NULL,
    CONSTRAINT ApplyFor_pk PRIMARY KEY (Student_StdID,Jobs_OfferID)
);

-- Table: Student
CREATE TABLE Student (
    StdID int  NOT NULL AUTO_INCREMENT,
    password varchar(100)  NOT NULL,
    email varchar(100)  NOT NULL,
    Name varchar(100)  NOT NULL,
    GradYear int  NOT NULL,
    major varchar(100)  NOT NULL,
    Resume blob  NOT NULL,
    CONSTRAINT Student_pk PRIMARY KEY (StdID)
)AUTO_INCREMENT=100;

-- Table: Assign_Interview
CREATE TABLE Assign_Interview (
    Employeer_EmpID int  NOT NULL,
    Student_StdID int  NOT NULL,
    Interview_InterviewID int  NOT NULL,
    Complete_Status boolean DEFAULT FALSE,
    CONSTRAINT Assign_Interview_pk PRIMARY KEY (Employeer_EmpID,Student_StdID,Interview_InterviewID)
);

-- Table: Booth
CREATE TABLE Booth (
    Block varchar(5)  NOT NULL,
    Number int  NOT NULL,
    date date  NOT NULL,
    time time  NOT NULL,
    ReserveStatus bool  NOT NULL,
    Employeer_EmpID int  NULL,
    CONSTRAINT Booth_pk PRIMARY KEY (Block,Number)
);

-- Table: CandidateForm
CREATE TABLE CandidateForm (
    CadID int NOT NULL AUTO_INCREMENT,
    Name varchar(100) NOT NULL,
    email varchar(100) NOT NULL,
    resume blob NOT NULL,
    ApplicationForm_ApplicationID int NOT NULL,
    studentID int NOT NULL,
    approved_status boolean DEFAULT FALSE,
    CONSTRAINT CandidateForm_pk PRIMARY KEY (CadID),
    CONSTRAINT CandidateForm_fk1 FOREIGN KEY (studentID) REFERENCES Student(StdID),
    CONSTRAINT CandidateForm_fk2 FOREIGN KEY (ApplicationForm_ApplicationID) REFERENCES ApplicationForm(ApplicationID)
);

-- Table: Comments
CREATE TABLE Comments (
    CommentID int  NOT NULL AUTO_INCREMENT,
    Comment varchar(100)  NOT NULL,
    Student_StdID int  NOT NULL,
    CONSTRAINT Comments_pk PRIMARY KEY (CommentID)
)AUTO_INCREMENT=1;

-- Table: Employeer
CREATE TABLE Employeer (
    EmpID int  NOT NULL AUTO_INCREMENT,
    Name varchar(100)  NOT NULL,
    password varchar(100)  NOT NULL,
	email varchar(100)  NOT NULL,
    CompanyDesp varchar(100)  NOT NULL,
    CompanyName varchar(100)  NOT NULL,
    CONSTRAINT Employeer_pk PRIMARY KEY (EmpID)
)AUTO_INCREMENT=100;

-- Table: Feedback
CREATE TABLE Feedback (
    feedbackID int  NOT NULL AUTO_INCREMENT,
    comment varchar(100)  NOT NULL,
    CONSTRAINT Feedback_pk PRIMARY KEY (feedbackID)
)AUTO_INCREMENT=1;

-- Table: Interview
CREATE TABLE Interview (
    InterviewID int  NOT NULL AUTO_INCREMENT,
    datetime datetime  NOT NULL,
    CONSTRAINT Interview_pk PRIMARY KEY (InterviewID)
)AUTO_INCREMENT=1;

-- Table: Jobs
CREATE TABLE Jobs (
    OfferID int  NOT NULL AUTO_INCREMENT,
    jobTitle varchar(100)  NOT NULL,
    salary int  NOT NULL,
    StartDate datetime  NOT NULL,
    Status bool  NOT NULL,
    Employeer_EmpID int  NOT NULL,
    JobDescription varchar(2048) NULL,
    CONSTRAINT Jobs_pk PRIMARY KEY (OfferID)
)AUTO_INCREMENT=100;

-- Table: MockUp_Interview
CREATE TABLE MockUp_Interview (
    mockID int  NOT NULL AUTO_INCREMENT,
    jobTitle varchar(100)  NOT NULL,
    questions blob  NOT NULL,
    Employeer_EmpID int  NOT NULL,
    CONSTRAINT MockUp_Interview_pk PRIMARY KEY (mockID)
)AUTO_INCREMENT=1;

-- Table: provide_feedback
CREATE TABLE provide_feedback (
    Employeer_EmpID int  NOT NULL,
    Feedback_feedbackID int  NOT NULL,
    Student_StdID int  NOT NULL,
    CONSTRAINT provide_feedback_pk PRIMARY KEY (Employeer_EmpID,Feedback_feedbackID,Student_StdID)
);

-- Admin table
CREATE TABLE `ADMIN` (
    AdminID int NOT NULL AUTO_INCREMENT,
    email varchar(100) NOT NULL,
    password varchar(100) NOT NULL,
    CONSTRAINT Admin_pk PRIMARY KEY (AdminID)
)AUTO_INCREMENT=1;


-- foreign keys
-- Reference: ApplicationForm_Jobs (table: ApplicationForm)
ALTER TABLE ApplicationForm ADD CONSTRAINT ApplicationForm_Jobs FOREIGN KEY ApplicationForm_Jobs (Jobs_OfferID)
    REFERENCES Jobs (OfferID);

-- Reference: ApplyFor_Jobs (table: ApplyFor)
ALTER TABLE ApplyFor ADD CONSTRAINT ApplyFor_Jobs FOREIGN KEY ApplyFor_Jobs (Jobs_OfferID)
    REFERENCES Jobs (OfferID);

-- Reference: ApplyFor_Student (table: ApplyFor)
ALTER TABLE ApplyFor ADD CONSTRAINT ApplyFor_Student FOREIGN KEY ApplyFor_Student (Student_StdID)
    REFERENCES Student (StdID);

-- Reference: Assign_Interview_Employeer (table: Assign_Interview)
ALTER TABLE Assign_Interview ADD CONSTRAINT Assign_Interview_Employeer FOREIGN KEY Assign_Interview_Employeer (Employeer_EmpID)
    REFERENCES Employeer (EmpID);

-- Reference: Assign_Interview_Interview (table: Assign_Interview)
ALTER TABLE Assign_Interview ADD CONSTRAINT Assign_Interview_Interview FOREIGN KEY Assign_Interview_Interview (Interview_InterviewID)
    REFERENCES Interview (InterviewID);

-- Reference: Assign_Interview_Student (table: Assign_Interview)
ALTER TABLE Assign_Interview ADD CONSTRAINT Assign_Interview_Student FOREIGN KEY Assign_Interview_Student (Student_StdID)
    REFERENCES Student (StdID);

-- Reference: Booth_Employeer (table: Booth)
ALTER TABLE Booth ADD CONSTRAINT Booth_Employeer FOREIGN KEY Booth_Employeer (Employeer_EmpID)
    REFERENCES Employeer (EmpID);

-- Reference: CandidateForm_ApplicationForm (table: CandidateForm)
ALTER TABLE CandidateForm ADD CONSTRAINT CandidateForm_ApplicationForm FOREIGN KEY CandidateForm_ApplicationForm (ApplicationForm_ApplicationID)
    REFERENCES ApplicationForm (ApplicationID);

-- Reference: Comments_Student (table: Comments)
ALTER TABLE Comments ADD CONSTRAINT Comments_Student FOREIGN KEY Comments_Student (Student_StdID)
    REFERENCES Student (StdID);

-- Reference: Jobs_Employeer (table: Jobs)
ALTER TABLE Jobs ADD CONSTRAINT Jobs_Employeer FOREIGN KEY Jobs_Employeer (Employeer_EmpID)
    REFERENCES Employeer (EmpID);

-- Reference: MockUp_Interview_Employeer (table: MockUp_Interview)
ALTER TABLE MockUp_Interview ADD CONSTRAINT MockUp_Interview_Employeer FOREIGN KEY MockUp_Interview_Employeer (Employeer_EmpID)
    REFERENCES Employeer (EmpID);

-- Reference: provide_feedback_Employeer (table: provide_feedback)
ALTER TABLE provide_feedback ADD CONSTRAINT provide_feedback_Employeer FOREIGN KEY provide_feedback_Employeer (Employeer_EmpID)
    REFERENCES Employeer (EmpID);

-- Reference: provide_feedback_Feedback (table: provide_feedback)
ALTER TABLE provide_feedback ADD CONSTRAINT provide_feedback_Feedback FOREIGN KEY provide_feedback_Feedback (Feedback_feedbackID)
    REFERENCES Feedback (feedbackID);

-- Reference: provide_feedback_Student (table: provide_feedback)
ALTER TABLE provide_feedback ADD CONSTRAINT provide_feedback_Student FOREIGN KEY provide_feedback_Student (Student_StdID)
    REFERENCES Student (StdID);


-- insert queries 
 

  
  
INSERT INTO Employeer (Name, password, email, CompanyDesp, CompanyName) VALUES
  ('Zainab Khan', 'password123', 'zainab.khan@gmail.com', 'Software company', 'XYZ Consulting'),
  ('Farhan Malik', 'password456', 'farhan.malik@gmail.com', 'IT services', 'ABC Technologies');
  
  INSERT INTO Student (password, email, Name, GradYear, major, Resume) VALUES
  ('password789', 'saira.malik@example.com', 'Saira Malik', 2024, 'Computer Science', '...'),
  ('password321', 'omar.ahmed@example.com', 'Omar Ahmed', 2025, 'Business Administration', '...');
  

  INSERT INTO Booth (Block, Number, date, time, ReserveStatus) VALUES
  ('A', 101, '2023-05-01', '09:00:00', false),
  ('A', 203, '2023-05-01', '10:00:00', false),
  ('B', 104, '2023-05-02', '11:00:00', false),
  ('B', 205, '2023-05-02', '12:00:00', false),
  ('C', 109, '2023-05-03', '13:00:00', false);
-- End of file.

