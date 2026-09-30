# AIRA (Akash Intelligent Reactive Assistant) - Project Setup & Architecture Plan

Based on the latest updates to `documentation.txt`, we can see that **none** of the Core Documents are marked as completed. Therefore, our immediate focus before writing any Python code is to establish the complete architectural blueprint.

## Phase 0: Core Architecture Documentation
We will generate all six mandatory foundational documents inside the `d:\learning\AIRA\doc\` directory. These ensure we know exactly what we are building, how it communicates, and how it is secured.

### 1. Project Overview & Design
- **[UPDATE] `doc/readme.md`**: Refining the existing overview, tech stack, setup steps, and architecture summary.
- **[NEW] `doc/tdd.md`**: **Technical Design Document**: Formal breakdown of the architecture, components (AI Brain, Agents, Gateway), system flows, and a phased rollout plan.
- **[NEW] `doc/srs.md`**: **Software Requirements Specification (SRS)**: Explicit functional and non-functional requirements, and primary use cases (e.g. coding assistant, email sending, OS control).

### 2. Contracts & Data Strategy
- **[NEW] `doc/api_contract.md`**: **API Contract Document**: Specifying the exact endpoints between the Flutter App → .NET Core Gateway → Python FastAPI Engine, including Request/Response JSON payloads mapping to the command schema.
- **[NEW] `doc/database_design.md`**: **Database Design Document**: Explicitly mapping the PostgreSQL tables (`Users`, `Devices`, `ConversationHistory`) and the Pinecone index structures.
- **[NEW] `doc/database_design.md`**: **Database Design Document**: Explicitly mapping the PostgreSQL tables (`Users`, `Devices`, `ConversationHistory`) and the pgvector index structures.

### 3. Safety & Security
- **[NEW] `doc/security_design.md`**: **Security Design Document**: Outlining the JWT flow, local network binding rules, Device validation, and strict command execution restrictions.

---

## Phase 1: Code Scaffolding

Once we formalize the documentation, we will transition into building the execution layers.

#### [NEW] [ai-engine/requirements.txt](file:///d:/learning/AIRA/ai-engine/requirements.txt)
Python dependencies (`fastapi`, `uvicorn`, `requests`, `psycopg2-binary`, `pgvector`, `python-dotenv`, `pydantic`).

#### [NEW] `ai-engine/app/`
- **[NEW] [ai-engine/app/main.py](file:///d:/learning/AIRA/ai-engine/app/main.py)**: Entry point for the FastAPI application.
- **[NEW] `ai-engine/app/services/`**:
  - **[NEW] [llm_service.py](file:///d:/learning/AIRA/ai-engine/app/services/llm_service.py)**: Connects to local Ollama (`http://localhost:11434/api/generate`) using `llama3`.
  - **[NEW] [memory_service.py](file:///d:/learning/AIRA/ai-engine/app/services/memory_service.py)**: **PostgreSQL + pgvector** integration for unified memory.
  - **[NEW] [orchestrator.py](file:///d:/learning/AIRA/ai-engine/app/services/orchestrator.py)**: Converts user intent to a rigid structured command JSON.

### 2. Infrastructure Layer

#### [NEW] [infra/docker-compose.yml](file:///d:/learning/AIRA/infra/docker-compose.yml)
Self-hosted services including PostgreSQL with the `pgvector` extension.

### 3. Execution Layer
(Device Agents)
- **[NEW] `agents/laptop/laptop_agent.py`** (Receives JSON commands and executes OS-level actions)

## Open Questions

1. **Which document would you like me to generate first?** I can start with the **Technical Design Document (TDD)** or the **API Contract Document** since they heavily dictate how the code will be written.
2. Shall I begin drafting these documents immediately, or is there any additional reference material you'd like me to analyze?

## Verification Plan
1. We will review the generated Markdown documents one by one to ensure they meet your vision.
2. After the core documents are verified and approved, we will write the AI Engine logic and verify via test scripts.
