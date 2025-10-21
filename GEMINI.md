# 📚 Project Overview: AI Lesson Plan Generator

This project is an AI-powered lesson plan generator designed to create personalized lesson plans aligned with the Brazilian National Common Curricular Base (BNCC). It leverages Google Gemini AI for content generation and Supabase for data persistence. The system produces comprehensive lesson plans that include a playful introduction, specific BNCC learning objectives, a detailed step-by-step activity guide, and a structured evaluation rubric.

## 🛠️ Technologies Used

*   **Backend:** Node.js with Express.js, Supabase (PostgreSQL), Google Gemini AI (gemini-1.5-flash).
*   **Frontend:** HTML5, CSS3, JavaScript (vanilla JS) for a simple and responsive user interface.

## 🚀 Getting Started

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Jairzaoo/TesteTecnico2.git
    cd TesteTecnico2
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Configuration

1.  **Environment Variables:**
    *   Create a `.env` file in the project root by copying `.env.example`.
    *   Populate the following variables in your `.env` file:
        *   `SUPABASE_URL`: Your Supabase project URL.
        *   `SUPABASE_ANON_KEY`: Your Supabase anonymous key.
        *   `GEMINI_API_KEY`: Your Google Gemini API key.
        *   `PORT`: The port for the server (default is 3000).

2.  **Supabase Database Setup:**
    *   Go to your Supabase dashboard.
    *   Navigate to the SQL Editor.
    *   Copy the entire content of `database/schema.sql` from this project and paste it into a new query in the Supabase SQL Editor.
    *   Run the query to create the necessary tables (`profiles`, `planos_aula`, `geracoes_historico`) and configure Row Level Security (RLS).

### Running the Application

*   **Start the server:**
    ```bash
    npm start
    ```
*   **Access the application:** Open your web browser and go to `http://localhost:3000`.

### Development Mode

*   To run the server in watch mode for development:
    ```bash
    npm run dev
    ```

### Verification Scripts

The project includes scripts to help verify the setup:

*   `npm run verificar`: Executes `verificar-supabase.js` to check the Supabase connection and table existence.
*   `node verificar-setup-completo.js`: Provides a comprehensive check of the Supabase setup, including table verification and a test insertion.
*   `node executar-sql-supabase.js`: Attempts to execute SQL commands on Supabase. Note that DDL (Data Definition Language) commands might require manual execution in the Supabase SQL Editor.

## 💡 Development Conventions and Architecture

### API Endpoints

The backend provides the following RESTful API endpoints:

*   `POST /api/gerar-plano`: Generates a lesson plan using the configured Gemini AI model based on provided input data. The generated plan is then saved to the `planos_aula` table in Supabase.
*   `GET /api/planos`: Retrieves a list of saved lesson plans. It supports an optional `user_id` query parameter to filter plans by a specific user.
*   `GET /api/planos/:id`: Fetches a single lesson plan by its unique ID.
*   `GET /api/health`: A health check endpoint that returns the API status and confirms the availability of Gemini and Supabase configurations.

### Database Schema

The Supabase PostgreSQL database uses three main tables:

*   `profiles`: Stores user profile information, linked to `auth.users`.
*   `planos_aula`: Stores the generated lesson plans, including user inputs and the AI-generated JSON structure (`plano_gerado` column is JSONB).
*   `geracoes_historico`: Logs each lesson plan generation attempt for analytics, including AI model used, generation time, and success status.

Row Level Security (RLS) is enabled for all data tables, ensuring that users can only access and modify their own data.

### AI Model Integration

*   **Model Choice:** Google Gemini 1.5 Flash is used due to its free tier availability, fast response times, native JSON output capabilities, and its ability to understand educational contexts like BNCC.
*   **Prompt Engineering:** The `server.js` file contains a `criarPrompt` function that constructs a highly structured prompt for the Gemini AI. This prompt includes specific context, expected JSON format, and explicit instructions to ensure consistent and complete lesson plan generation.
*   **Response Parsing:** The server-side logic includes robust parsing and validation of the AI's JSON response to handle potential inconsistencies.

### Frontend Implementation

*   The frontend is built with vanilla HTML, CSS, and JavaScript (`public/index.html`, `public/styles.css`, `public/app.js`).
*   It features a responsive design and a user-friendly form for inputting lesson plan details.
*   Client-side validation and loading states are implemented to enhance user experience.
*   Functionality to print and copy the generated lesson plan JSON is also provided.

### Error Handling

The application incorporates comprehensive error handling on both the client and server sides, addressing issues such as invalid input, AI response parsing errors, and Supabase database operation failures. Errors are logged and appropriate messages are displayed to the user.
