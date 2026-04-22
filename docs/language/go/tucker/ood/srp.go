package main

type Report struct {
}

// 단일 책임 원칙 위배
type FinanceReport struct {
}

func (r *FinanceReport) MakeReport() *Report {
	return &Report{}
}

func (r *FinanceReport) SendReport(email string) {

}

// 레포트를 보내는 책임을 다른 객체로 분리
type ReportSender interface {
	SendReport(*Report)
}

type EmailReportSender struct {
}

func (s *EmailReportSender) SendReport(r *Report) {
	// 이메일 전송
}

type FileReportSender struct {
}

func (f *FileReportSender) SendReport(r *Report) {
	// 파일 전송
}
