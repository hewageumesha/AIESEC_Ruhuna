create database aiesec_ruhuna_2;

use aiesec_ruhuna_2;

INSERT INTO functions (name)
VALUES
    ('BD - Business/Partnership Development'),
    ('EWA - Engagement With AIESEC'),
    ('FIN - Finance'),
    ('ICX - Incoming Exchange'),
    ('IM - Information Management'),
    ('MKT - Marketing'),
    ('OD - Organistional Development/Expansions'),
    ('OGX - Outgoing Exchange'),
    ('Others'),
    ('President'),
    ('Q&A - Quality & Audit'),
    ('TM - Talent Management');
    
INSERT INTO departments (name) 
VALUES 
    ('iGV B2B & VD'),
    ('IGV M & IR'),
    ('iGT B3B & VD'),
    ('IGT M & IR'),
    ('oGV B2C'),
    ('oGV PS'),
    ('TM'),
    ('FnL'),
    ('BD'),
    ('ED'),
    ('MKT'),
    ('PR'),
    ('Q&A'),
    ('Others');
        
INSERT INTO users 
(id, first_name, last_name, aiesec_email, email, password, birthday, joined_date, role, status, function_id, department_id) 
VALUES  
('001', 'Krishanthi', 'Kristina', 'krishanthi001@aiesec.org', 'krishanthi@gmail.com', '$2a$12$Cm8S6OcguX58JUy/P2ERpezVr3bxSHOBEmGOsa4ksk3KLA712mzYu', '2001-10-03', '2023-01-05', 'LCP', 'Active', 10, 14),
('002', 'Nethmi', 'Umesha', 'nethmi002@aiesec.org', 'nethmi@gmail.com', '$12$feWS2V1Lb.wvj0vn09SY0u.kFW4UlvCsuOSoGvRYUvQx.bO9jLVUm', '2001-04-18', '2024-01-05', 'LCVP', 'Active', 1, 12),
('003', 'Sajiya', 'Roshan', 'sajiya003@aiesec.org', 'sajiya@gmail.com', '$12$5M6fWOfua0XId2f0HhlHbeZo9wx/0y6JhC5lv7B1CPxN4.DNohIh2', '2001-08-13', '2023-01-05', 'Team_Leader', 'Inactive', 3, 7),
('004', 'Ishara', 'Palagasingha', 'ishara004@aiesec.org', 'ishara@gmail.com', '$12$OndsIR7CKNmvNGQbLQUB7OQUjEZJtrVPuo2jhc.sZm3ccUWRKWT7u', '2001-12-07', '2025-01-05', 'Member', 'Active', 1, 12);


