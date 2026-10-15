import { Course, Module, Lesson, Resource, LiveSession, Assignment, Enrollment, Payment, Submission, Certificate, User } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_student_1',
    name: 'Rahim Ahmed',
    email: 'rahim.ahmed@example.com',
    phone: '01712345678',
    role: 'student',
    created_at: '2026-09-01T10:00:00Z',
  },
  {
    id: 'usr_admin_1',
    name: 'Instructor / Admin (IT Data Science)',
    email: 'admin@itdatascience.com',
    phone: '01887654321',
    role: 'admin',
    created_at: '2026-08-15T09:00:00Z',
  },
  {
    id: 'usr_student_2',
    name: 'Nusrat Jahan',
    email: 'nusrat.jahan@example.com',
    phone: '01998765432',
    role: 'student',
    created_at: '2026-10-10T14:30:00Z',
  }
];

export const COURSES: Course[] = [
  {
    id: 'c_excel',
    slug: 'excel-data-analytics',
    title: 'Microsoft Excel for Data Analytics & Business Intelligence',
    summary: 'Master real-world data analysis, dynamic dashboarding, XLOOKUP, advanced Pivot Tables, and business reporting from zero to job-ready.',
    description: `This comprehensive masterclass takes you from absolute Excel fundamentals to constructing executive-grade interactive business intelligence dashboards. Designed specifically for university students, job seekers, and business professionals in Bangladesh looking to break into data analytics, financial modeling, and corporate reporting.\n\nIncludes hands-on real retail and eCommerce sales datasets, weekly live Zoom problem-solving classes in Bangla/English, instructor-graded portfolio projects, and a verifiable digital certificate.`,
    level: 'Beginner',
    price_bdt: 1500,
    is_published: true,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    instructor: {
      name: 'Engr. Tanvir Hasan',
      title: 'Senior Data Analyst & Analytics Lead at IT Data Science',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    duration_weeks: 6,
    total_lessons: 14,
    total_hours: 18,
    tags: ['Excel', 'Data Analysis', 'Pivot Tables', 'Dashboards', 'Business Intelligence'],
  },
  {
    id: 'c_sql',
    slug: 'sql-relational-databases',
    title: 'SQL & Relational Databases for Beginners',
    summary: 'Learn PostgreSQL, database schema design, joins, aggregations, and window functions to query business data effortlessly.',
    description: 'Get confident writing complex SQL queries from scratch. Practice directly with PostgreSQL databases, solve business scenarios, and prepare for technical data interviews.',
    level: 'Beginner',
    price_bdt: 0, // Free course
    is_published: true,
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=900&q=80',
    instructor: {
      name: 'Dr. Shahriar Kabir',
      title: 'Database Architect & ITDS Lead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    duration_weeks: 4,
    total_lessons: 8,
    total_hours: 10,
    tags: ['SQL', 'PostgreSQL', 'Databases', 'Free Course'],
  },
  {
    id: 'c_python',
    slug: 'python-data-science',
    title: 'Python for Data Analysis: Pandas, NumPy & Visualization',
    summary: 'Automate repetitive workflows, clean messy datasets, and craft compelling visual narratives using Python, Pandas, and Seaborn.',
    description: 'Bridge the gap between spreadsheets and programming. Learn how modern data scientists ingest, clean, transform, and communicate insights with Python.',
    level: 'Intermediate',
    price_bdt: 2500,
    is_published: true,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80',
    instructor: {
      name: 'Engr. Tanvir Hasan',
      title: 'Senior Data Analyst & Analytics Lead at IT Data Science',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    duration_weeks: 8,
    total_lessons: 16,
    total_hours: 24,
    tags: ['Python', 'Pandas', 'NumPy', 'Visualization'],
  }
];

export const MODULES: Module[] = [
  {
    id: 'm_excel_1',
    course_id: 'c_excel',
    title: 'Module 1: Excel Fundamentals & Essential Navigation',
    position: 1,
    description: 'Worksheet navigation, data types, shortcuts, relative vs absolute referencing ($), and formatting essentials.',
  },
  {
    id: 'm_excel_2',
    course_id: 'c_excel',
    title: 'Module 2: Essential Formulas & Data Manipulation Functions',
    position: 2,
    description: 'Logical conditions (IF, IFS, AND, OR), text cleanup functions, DATE functions, and math aggregations.',
  },
  {
    id: 'm_excel_3',
    course_id: 'c_excel',
    title: 'Module 3: Modern Lookups & Data Matching (XLOOKUP, INDEX-MATCH)',
    position: 3,
    description: 'Transition from VLOOKUP to dynamic XLOOKUP, handling errors with IFERROR, and 2-way lookups with INDEX/MATCH.',
  },
  {
    id: 'm_excel_4',
    course_id: 'c_excel',
    title: 'Module 4: Pivot Tables, Slicers & Summarization Magic',
    position: 4,
    description: 'Building multi-dimensional pivot tables, calculated fields, group dates by quarter/year, and interactive slicers.',
  },
  {
    id: 'm_excel_5',
    course_id: 'c_excel',
    title: 'Module 5: Capstone Project: Executive Sales Dashboard',
    position: 5,
    description: 'Designing a C-suite interactive KPI dashboard with dynamic charts, timeline controls, and formatted summary cards.',
  }
];

export const LESSONS: Lesson[] = [
  // Module 1
  {
    id: 'les_1',
    module_id: 'm_excel_1',
    course_id: 'c_excel',
    title: '1.1 Welcome to Learn Platform & Course Roadmap',
    position: 1,
    youtube_id: 'k1VUZEVuG84', // Embeddable high-quality Excel starter
    duration_min: 12,
    notes_md: `### Welcome to IT Data Science Excel Masterclass!

In this kickoff lesson, we outline the roadmap for the next 6 weeks:
- **Week 1-2**: Foundation, cell addressing, and formula foundations.
- **Week 3-4**: Lookups, cleanup, and multi-table merges.
- **Week 5-6**: Pivot tables, charts, and your capstone executive dashboard.

**Key Best Practices:**
1. Always keep your raw data unformatted in a dedicated sheet named \`raw_data\`.
2. Never merge cells inside raw data tables (it breaks filtering and sorting).
3. Use Excel Table formats (\`Ctrl + T\`) for automatic dynamic range expansion.`,
    is_free_preview: true,
  },
  {
    id: 'les_2',
    module_id: 'm_excel_1',
    course_id: 'c_excel',
    title: '1.2 Keyboard Shortcuts & Speed Navigation (Bangla & English Tips)',
    position: 2,
    youtube_id: 'Vl0H-qTclOg',
    duration_min: 18,
    notes_md: `### Top Productivity Shortcuts for Data Analysts

- \`Ctrl + Arrow Keys\`: Jump to the extreme edge of the data block.
- \`Ctrl + Shift + Arrow Keys\`: Highlight contiguous range.
- \`Ctrl + Space\`: Select entire column.
- \`Shift + Space\`: Select entire row.
- \`Ctrl + 1\`: Format Cells dialog (super handy for currency BDT and custom dates).
- \`F4\` / \`Fn + F4\`: Toggle absolute cell lock ($A$1 -> A$1 -> $A1 -> A1).`,
    is_free_preview: true,
  },
  {
    id: 'les_3',
    module_id: 'm_excel_1',
    course_id: 'c_excel',
    title: '1.3 Absolute ($) vs Relative Cell Referencing Demystified',
    position: 3,
    youtube_id: 'eI_7oc-E3h0',
    duration_min: 15,
    notes_md: `### Absolute vs Relative References

When you drag formulas across rows and columns:
- **Relative Reference (\`A1\`)**: Changes column and row as you drag.
- **Absolute Reference (\`$A$1\`)**: Locks both column A and row 1.
- **Mixed Reference (\`$A1\` or \`A$1\`)**: Locks either column or row. Ideal for tax rates, VAT % calculations, or exchange rates.`,
    is_free_preview: false,
  },

  // Module 2
  {
    id: 'les_4',
    module_id: 'm_excel_2',
    course_id: 'c_excel',
    title: '2.1 Logical Decisions: IF, IFS, AND, & OR',
    position: 1,
    youtube_id: 'tNqmN1qO2oM',
    duration_min: 22,
    notes_md: `### Conditional Formulas

Syntax:
\`\`\`excel
=IF(logical_test, value_if_true, value_if_false)
\`\`\`

Nested conditions for sales commission:
\`\`\`excel
=IFS(Sales >= 100000, "15% Bonus", Sales >= 50000, "10% Bonus", TRUE, "No Bonus")
\`\`\`

Always test edge conditions (e.g. exactly 50,000)!`,
    is_free_preview: false,
  },
  {
    id: 'les_5',
    module_id: 'm_excel_2',
    course_id: 'c_excel',
    title: '2.2 Text Cleanup Functions: TRIM, CLEAN, PROPER, LEFT, RIGHT',
    position: 2,
    youtube_id: '7y_N4z1a4hE',
    duration_min: 20,
    notes_md: `### Handling Messy Bangladeshi Customer Data

When exporting records from ERPs or Google Forms:
1. Extra whitespace causes lookup failures: \`=TRIM(A2)\` removes leading, trailing, and duplicate spaces.
2. Case inconsistencies: \`=PROPER(B2)\` turns "dHaKa" into "Dhaka".
3. Extracting phone prefixes: \`=LEFT(Phone, 3)\` extracts "017", "018", "019".`,
    is_free_preview: false,
  },

  // Module 3
  {
    id: 'les_6',
    module_id: 'm_excel_3',
    course_id: 'c_excel',
    title: '3.1 Modern Matching with XLOOKUP: Syntax & Superpowers',
    position: 1,
    youtube_id: 'qE5Y6u2PZ_c',
    duration_min: 25,
    notes_md: `### Why XLOOKUP Replaced VLOOKUP & HLOOKUP

Syntax:
\`\`\`excel
=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])
\`\`\`

**Key advantages over VLOOKUP:**
- Lookups can search leftwards (no need to keep ID column first).
- Built-in \`if_not_found\` argument avoids ugly \`IFERROR(VLOOKUP(...), "Not Found")\`.
- Defaults to exact match (no more accidental \`FALSE\` omission bugs).`,
    is_free_preview: false,
  },
  {
    id: 'les_7',
    module_id: 'm_excel_3',
    course_id: 'c_excel',
    title: '3.2 Handling Errors like a Pro (IFERROR, ISNA, & Verification)',
    position: 2,
    youtube_id: 'q8FjY-gEa6A',
    duration_min: 17,
    notes_md: `### Robust Error Handling

Common Excel error codes:
- \`#N/A\`: Lookup value does not exist in target range.
- \`#VALUE!\`: Wrong data type (e.g., adding text to a number).
- \`#DIV/0!\`: Dividing by zero (fix with \`=IF(Denom=0, 0, Num/Denom)\`).
- \`#REF!\`: Cell reference was deleted.`,
    is_free_preview: false,
  },

  // Module 4
  {
    id: 'les_8',
    module_id: 'm_excel_4',
    course_id: 'c_excel',
    title: '4.1 Creating Dynamic Pivot Tables in 60 Seconds',
    position: 1,
    youtube_id: 'm0wI61ahfLc',
    duration_min: 28,
    notes_md: `### The Power of Pivot Tables

Transform 50,000 rows into clear business insights:
- **Rows**: Products, Categories, or Sales Reps.
- **Columns**: Fiscal Quarters or Payment Methods (bKash, Card, Cash).
- **Values**: Sum of Revenue, Average Order Value (AOV).
- **Filters**: Region (Dhaka, Chittagong, Sylhet).`,
    is_free_preview: false,
  },
  {
    id: 'les_9',
    module_id: 'm_excel_4',
    course_id: 'c_excel',
    title: '4.2 Interactive Slicers & Timeline Filters for Dashboards',
    position: 2,
    youtube_id: '3W1gLhH0Fao',
    duration_min: 24,
    notes_md: `### Connecting Slicers to Multiple Pivot Tables

- How to add Slicers from the PivotTable Analyze tab.
- Click **Report Connections** to connect a single Slicer to 4 different Pivot Tables!
- When you click "Dhaka Division", all four charts update synchronously.`,
    is_free_preview: false,
  },

  // Module 5
  {
    id: 'les_10',
    module_id: 'm_excel_5',
    course_id: 'c_excel',
    title: '5.1 Capstone Architecture: Designing an Executive Dashboard',
    position: 1,
    youtube_id: 'lP_8W6K6Uu0',
    duration_min: 35,
    notes_md: `### Capstone Dashboard Layout Guide

Structure your workbook into 4 clean layers:
1. **Raw_Data**: Untouched source data.
2. **Lookup_Tables**: Dimension tables (Products, Branches, Exchange Rates).
3. **Calculation_Engine**: Where your Pivot Tables and formulas live (hide this tab from executives).
4. **Dashboard**: The presentation canvas with zero gridlines, clean KPI summary cards, and connected charts.`,
    is_free_preview: false,
  }
];

export const RESOURCES: Resource[] = [
  {
    id: 'res_1',
    course_id: 'c_excel',
    module_id: 'm_excel_1',
    title: 'Excel Shortcuts & Formula Quick Reference Guide (PDF)',
    file_name: 'ITDS_Excel_Formulas_CheatSheet_v2.pdf',
    file_size: '2.4 MB',
    type: 'pdf',
  },
  {
    id: 'res_2',
    course_id: 'c_excel',
    module_id: 'm_excel_2',
    title: 'Starter Raw Dataset: BD eCommerce Sales 2025-2026 (XLSX)',
    file_name: 'Raw_Sales_Data_Bangladesh_2026.xlsx',
    file_size: '4.8 MB',
    type: 'excel',
  },
  {
    id: 'res_3',
    course_id: 'c_excel',
    module_id: 'm_excel_5',
    title: 'Capstone Project Starter Template with KPI Card Layouts',
    file_name: 'Capstone_Dashboard_Starter_Template.xlsx',
    file_size: '1.9 MB',
    type: 'excel',
  }
];

export const LIVE_SESSIONS: LiveSession[] = [
  {
    id: 'live_1',
    course_id: 'c_excel',
    title: 'Live Lab 01: Live Formula Debugging, bKash/Nagad Sales Case Study & Q&A',
    starts_at: '2026-10-18T14:30:00Z', // 8:30 PM Dhaka Time (UTC+6)
    duration_min: 90,
    meet_url: 'https://zoom.us/j/98765432101',
    meeting_id: '987 6543 2101',
    passcode: 'ITDS2026',
    language: 'bn',
    instructor_name: 'Engr. Tanvir Hasan',
    topic_summary: 'We will solve real-world reconciliation issues between bKash/Nagad MFS merchant reports and database exports using XLOOKUP and conditional formatting.',
  },
  {
    id: 'live_2',
    course_id: 'c_excel',
    title: 'Live Lab 02: Capstone Project Review & Portfolio Polish',
    starts_at: '2026-10-25T14:30:00Z', // 8:30 PM Dhaka Time
    duration_min: 90,
    meet_url: 'https://zoom.us/j/98765432102',
    meeting_id: '987 6543 2102',
    passcode: 'EXCELPRO',
    language: 'bn',
    instructor_name: 'Engr. Tanvir Hasan',
    topic_summary: 'Live review of student dashboard submissions. Tips on adding this project to your LinkedIn, CV, and GitHub portfolio.',
  }
];

export const ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg_1',
    module_id: 'm_excel_5',
    course_id: 'c_excel',
    title: 'Capstone Assignment: Executive eCommerce Sales Dashboard',
    instructions_md: `### Assignment Objective:
Download the provided raw dataset (\`Raw_Sales_Data_Bangladesh_2026.xlsx\`) and build an executive sales dashboard meeting the following specifications:

1. **KPI Summary Cards:**
   - Total Gross Revenue (in BDT)
   - Total Number of Orders Completed
   - Average Order Value (AOV)
   - Overall Cancellation / Return Rate (%)

2. **Visualizations:**
   - Monthly Revenue Trend (Line Chart with markers)
   - Sales by Division (Bar chart showing Dhaka, Chattogram, Sylhet, Rajshahi, etc.)
   - Payment Method Distribution (bKash vs Nagad vs Rocket vs COD)

3. **Interactivity:**
   - Connect at least two Slicers (Year/Month and Payment Method) using Report Connections.
   - Clean up gridlines, use corporate color palettes, and ensure numbers have proper BDT formatting.

**Submission Guidelines:**
- Submit your completed \`.xlsx\` file below (Max 10MB).
- Passing Score: **50 / 100**.`,
    max_score: 100,
    pass_score: 50,
    due_date_formatted: 'October 28, 2026 at 11:59 PM (Dhaka Time)',
    sample_resource: {
      name: 'Raw_Sales_Data_Bangladesh_2026.xlsx',
      size: '4.8 MB',
    }
  }
];

export const INITIAL_ENROLLMENTS: Enrollment[] = [
  {
    id: 'enr_1',
    user_id: 'usr_student_1',
    course_id: 'c_excel',
    status: 'active',
    created_at: '2026-09-02T11:00:00Z',
    approved_at: '2026-09-02T12:30:00Z',
    approved_by: 'usr_admin_1',
  },
  {
    id: 'enr_2',
    user_id: 'usr_student_2',
    course_id: 'c_excel',
    status: 'pending',
    created_at: '2026-10-14T09:15:00Z',
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay_1',
    enrollment_id: 'enr_1',
    user_id: 'usr_student_1',
    user_name: 'Rahim Ahmed',
    user_email: 'rahim.ahmed@example.com',
    course_id: 'c_excel',
    course_title: 'Microsoft Excel for Data Analytics',
    method: 'bkash',
    amount_bdt: 1500,
    sender_number: '01712345678',
    trx_id: '9K48BL201A',
    status: 'verified',
    admin_note: 'Verified in bKash Merchant App. Welcome aboard!',
    created_at: '2026-09-02T11:05:00Z',
    verified_at: '2026-09-02T12:30:00Z',
  },
  {
    id: 'pay_2',
    enrollment_id: 'enr_2',
    user_id: 'usr_student_2',
    user_name: 'Nusrat Jahan',
    user_email: 'nusrat.jahan@example.com',
    course_id: 'c_excel',
    course_title: 'Microsoft Excel for Data Analytics',
    method: 'nagad',
    amount_bdt: 1500,
    sender_number: '01998765432',
    trx_id: '7M12KP990B',
    status: 'submitted', // Needs admin approval in queue
    created_at: '2026-10-14T09:20:00Z',
  }
];

export const INITIAL_PROGRESS: string[] = [
  'les_1',
  'les_2',
  'les_3',
  'les_4',
  'les_5',
  'les_6',
  'les_7',
  'les_8',
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub_1',
    assignment_id: 'asg_1',
    assignment_title: 'Capstone Assignment: Executive eCommerce Sales Dashboard',
    user_id: 'usr_student_1',
    user_name: 'Rahim Ahmed',
    user_email: 'rahim.ahmed@example.com',
    attempt: 1,
    original_name: 'Rahim_Ahmed_Excel_Capstone_Dashboard_v1.xlsx',
    size_bytes: 3450000,
    file_size_formatted: '3.45 MB',
    status: 'graded',
    score: 94,
    feedback: 'Outstanding work Rahim! Slicers connect seamlessly to all four pivot charts, KPI cards are clearly laid out, and BDT currency formatting is clean. Well deserved grade.',
    submitted_at: '2026-10-05T18:40:00Z',
    graded_at: '2026-10-06T10:15:00Z',
  },
  {
    id: 'sub_2',
    assignment_id: 'asg_1',
    assignment_title: 'Capstone Assignment: Executive eCommerce Sales Dashboard',
    user_id: 'usr_student_2',
    user_name: 'Nusrat Jahan',
    user_email: 'nusrat.jahan@example.com',
    attempt: 1,
    original_name: 'Nusrat_Jahan_Sales_Dashboard_Draft.xlsx',
    size_bytes: 4120000,
    file_size_formatted: '4.12 MB',
    status: 'submitted', // Pending instructor grading
    submitted_at: '2026-10-14T16:00:00Z',
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert_1',
    user_id: 'usr_student_1',
    user_name: 'Rahim Ahmed',
    course_id: 'c_excel',
    course_title: 'Microsoft Excel for Data Analytics & Business Intelligence',
    code: 'ITDS-EXCEL-2026-8942',
    issued_at: '2026-10-08T12:00:00Z',
    grade_text: 'Distinction (94/100)',
  }
];
