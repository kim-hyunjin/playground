using System;

namespace WindowsFormsApp1.Models
{
    /// <summary>
    /// 지출 한 건을 나타내는 데이터 모델입니다.
    /// WinForms에서는 WPF처럼 UI와 자동 바인딩되지 않으므로,
    /// 폼 코드에서 이 클래스의 속성을 직접 읽고 씁니다.
    /// </summary>
    public class ExpenseItem
    {
        /// <summary>고유 식별자 (목록에서 수정·삭제 시 사용)</summary>
        public Guid Id { get; set; }

        /// <summary>지출 발생 일자</summary>
        public DateTime Date { get; set; }

        /// <summary>카테고리 (식비, 교통, 쇼핑 등)</summary>
        public string Category { get; set; }

        /// <summary>지출 내용 설명</summary>
        public string Description { get; set; }

        /// <summary>금액 (원)</summary>
        public decimal Amount { get; set; }

        public ExpenseItem()
        {
            Id = Guid.NewGuid();
            Date = DateTime.Today;
            Category = "기타";
            Description = string.Empty;
        }

        /// <summary>DataGridView 표시용 요약 문자열</summary>
        public override string ToString()
        {
            return string.Format("{0:yyyy-MM-dd} [{1}] {2} - {3:N0}원",
                Date, Category, Description, Amount);
        }
    }
}
