using System;
using System.Globalization;
using System.Windows.Forms;
using WindowsFormsApp1.Models;

namespace WindowsFormsApp1
{
    /// <summary>
    /// 지출 추가/수정용 모달 대화상자입니다.
    /// ShowDialog()로 열면 사용자가 확인/취소할 때까지 부모 폼이 블로킹됩니다.
    /// </summary>
    public partial class ExpenseEditForm : Form
    {
        private readonly ExpenseItem _item;

        /// <summary>사용자가 확인을 눌렀을 때 편집된 데이터</summary>
        public ExpenseItem ResultItem => _item;

        /// <summary>새 지출 추가 모드</summary>
        public ExpenseEditForm()
        {
            InitializeComponent();
            _item = new ExpenseItem();
            Text = "지출 추가";
        }

        /// <summary>기존 지출 수정 모드</summary>
        public ExpenseEditForm(ExpenseItem existing)
        {
            InitializeComponent();
            _item = new ExpenseItem
            {
                Id = existing.Id,
                Date = existing.Date,
                Category = existing.Category,
                Description = existing.Description,
                Amount = existing.Amount
            };
            Text = "지출 수정";
        }

        private void ExpenseEditForm_Load(object sender, EventArgs e)
        {
            // 콤보박스에 카테고리 목록 채우기
            cmbCategory.Items.AddRange(new object[]
            {
                "식비", "교통", "쇼핑", "주거", "의료", "문화", "기타"
            });

            // 폼 필드에 현재 값 반영
            dtpDate.Value = _item.Date;
            cmbCategory.Text = _item.Category;
            txtDescription.Text = _item.Description;
            txtAmount.Text = _item.Amount.ToString("N0", CultureInfo.InvariantCulture);
        }

        private void btnOk_Click(object sender, EventArgs e)
        {
            // ErrorProvider로 입력 검증 — WinForms의 표준 패턴
            errorProvider.Clear();

            if (string.IsNullOrWhiteSpace(cmbCategory.Text))
            {
                errorProvider.SetError(cmbCategory, "카테고리를 선택하세요.");
                cmbCategory.Focus();
                return;
            }

            if (string.IsNullOrWhiteSpace(txtDescription.Text))
            {
                errorProvider.SetError(txtDescription, "내용을 입력하세요.");
                txtDescription.Focus();
                return;
            }

            // 금액 파싱 (쉼표 제거 후 decimal 변환)
            string amountText = txtAmount.Text.Replace(",", "").Trim();
            if (!decimal.TryParse(amountText, NumberStyles.Number, CultureInfo.InvariantCulture, out decimal amount)
                || amount <= 0)
            {
                errorProvider.SetError(txtAmount, "0보다 큰 금액을 입력하세요.");
                txtAmount.Focus();
                return;
            }

            // 검증 통과 — 모델에 값 저장 후 DialogResult 설정
            _item.Date = dtpDate.Value.Date;
            _item.Category = cmbCategory.Text.Trim();
            _item.Description = txtDescription.Text.Trim();
            _item.Amount = amount;

            DialogResult = DialogResult.OK;
            Close();
        }

        private void btnCancel_Click(object sender, EventArgs e)
        {
            DialogResult = DialogResult.Cancel;
            Close();
        }
    }
}
