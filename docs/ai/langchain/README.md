# LangChain 실습: LLM 애플리케이션 구축의 핵심 패턴

본 프로젝트는 대규모 언어 모델(LLM)을 실무 애플리케이션에 결합하기 위한 프레임워크인 **LangChain**의 주요 기능과 디자인 패턴을 실습한 공간입니다. 단순한 채팅을 넘어, 문서 기반 지식 검색(RAG), 자율 에이전트, 대화 메모리 관리 등을 다룹니다.

---

## 🏗 핵심 패턴: RAG (Retrieval-Augmented Generation)

LLM의 최신 정보 부재나 환각(Hallucination) 문제를 해결하기 위해, 외부 문서(PDF 등)에서 관련 정보를 검색하여 프롬프트에 포함하는 기법입니다.

### 1. 문서 로드 및 벡터화 (Indexing)
PDF 문서를 의미 있는 단위(Chunk)로 나누고, 이를 벡터로 변환하여 벡터 데이터베이스(Pinecone 등)에 저장합니다.

```python
# ai/langchain/udemy-masterclass/pdf-app/app/chat/create_embeddings.py
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

def create_embeddings_for_pdf(pdf_id, pdf_path):
    # 1. 문서 로드 및 텍스트 분할 (Chunking)
    loader = PyPDFLoader(pdf_path)
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    docs = loader.load_and_split(text_splitter)

    # 2. 메타데이터 추가 및 벡터 저장소 저장
    vector_store.add_documents(docs)
```

### 2. 검색 및 생성 (Retrieval & Generation)
사용자의 질문과 유사한 문서 청크를 찾고, 이를 바탕으로 답변을 생성하는 체인(Chain)을 구성합니다.

```python
# ai/langchain/udemy-masterclass/pdf-app/app/chat/chains/retrieval.py
from langchain.chains import ConversationalRetrievalChain

# 대화 기록과 문맥을 고려한 검색 체인 구성
class StreamingConversationalRetrievalChain(ConversationalRetrievalChain):
    pass
```

---

## 🧠 주요 구성 요소 (Core Modules)

### 1. Chains & Agents
- **Chains:** 여러 개의 LLM 호출이나 도구 사용을 순차적으로 연결합니다.
- **Agents:** LLM이 스스로 판단하여 어떤 도구(계산기, 검색 등)를 사용할지 결정하는 자율적인 실행 단위입니다.

### 2. Memory (대화 기록 관리)
- **SQL 기반 메모리:** 대화 내역을 데이터베이스에 영구 저장하여 세션이 끊겨도 맥락을 유지합니다.
- **Window Memory:** 최근 N개의 대화만 기억하여 토큰 사용량을 최적화합니다.

### 3. Vector Stores & Embeddings
- **OpenAI Embeddings:** 텍스트의 의미를 고차원 벡터로 변환.
- **Pinecone / FAISS:** 수만 개의 벡터 데이터 중 유사한 것을 빠르게 검색.

---

## 📈 학습 포인트
- **Prompt Engineering:** LLM으로부터 원하는 결과를 얻기 위한 정교한 지시문 설계.
- **Token Management:** 비용과 성능의 균형을 맞추기 위한 텍스트 분할 및 필터링 전략.
- **Streaming:** 사용자 경험을 높이기 위해 LLM의 응답을 실시간으로 출력하는 기술.

---
*본 프로젝트는 단순한 챗봇을 넘어 지능형 AI 에이전트 시스템으로 나아가는 가교 역할을 합니다.*
