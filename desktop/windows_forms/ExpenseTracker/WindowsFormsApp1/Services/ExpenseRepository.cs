using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Xml.Serialization;
using WindowsFormsApp1.Models;

namespace WindowsFormsApp1.Services
{
    /// <summary>
    /// 지출 데이터를 메모리에서 관리하고 XML 파일로 저장/불러오기 합니다.
    /// 실무에서는 Entity Framework, SQLite, REST API 등으로 대체됩니다.
    /// </summary>
    public class ExpenseRepository
    {
        private readonly List<ExpenseItem> _items = new List<ExpenseItem>();

        /// <summary>현재 저장된 전체 지출 목록 (읽기 전용 뷰)</summary>
        public IReadOnlyList<ExpenseItem> Items => _items.AsReadOnly();

        /// <summary>샘플 데이터로 목록을 초기화합니다.</summary>
        public void LoadSampleData()
        {
            _items.Clear();
            _items.Add(new ExpenseItem
            {
                Date = DateTime.Today.AddDays(-2),
                Category = "식비",
                Description = "점심 식사",
                Amount = 12000
            });
            _items.Add(new ExpenseItem
            {
                Date = DateTime.Today.AddDays(-1),
                Category = "교통",
                Description = "지하철 정기권",
                Amount = 55000
            });
            _items.Add(new ExpenseItem
            {
                Date = DateTime.Today,
                Category = "쇼핑",
                Description = "생활용품",
                Amount = 34500
            });
        }

        public void Add(ExpenseItem item)
        {
            if (item == null) throw new ArgumentNullException(nameof(item));
            _items.Add(item);
        }

        public void Update(ExpenseItem item)
        {
            if (item == null) throw new ArgumentNullException(nameof(item));
            int index = _items.FindIndex(x => x.Id == item.Id);
            if (index >= 0)
                _items[index] = item;
        }

        public void Remove(Guid id)
        {
            _items.RemoveAll(x => x.Id == id);
        }

        public ExpenseItem FindById(Guid id)
        {
            return _items.FirstOrDefault(x => x.Id == id);
        }

        /// <summary>
        /// 조건에 맞는 지출만 필터링합니다.
        /// WinForms에서는 LINQ 결과를 BindingSource.DataSource에 다시 넣어 그리드를 갱신합니다.
        /// </summary>
        public List<ExpenseItem> Filter(string category, string keyword, DateTime? from, DateTime? to)
        {
            IEnumerable<ExpenseItem> query = _items;

            if (!string.IsNullOrEmpty(category) && category != "전체")
                query = query.Where(x => x.Category == category);

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                string lower = keyword.Trim().ToLower();
                query = query.Where(x =>
                    (x.Description ?? "").ToLower().Contains(lower) ||
                    (x.Category ?? "").ToLower().Contains(lower));
            }

            if (from.HasValue)
                query = query.Where(x => x.Date.Date >= from.Value.Date);

            if (to.HasValue)
                query = query.Where(x => x.Date.Date <= to.Value.Date);

            return query.OrderByDescending(x => x.Date).ToList();
        }

        public decimal GetTotalAmount(IEnumerable<ExpenseItem> items)
        {
            return items.Sum(x => x.Amount);
        }

        /// <summary>XML 파일로 저장 (.NET Framework 내장 XmlSerializer 사용)</summary>
        public void SaveToFile(string filePath)
        {
            var serializer = new XmlSerializer(typeof(List<ExpenseItem>));
            using (var stream = File.Create(filePath))
            {
                serializer.Serialize(stream, _items);
            }
        }

        /// <summary>XML 파일에서 불러오기</summary>
        public void LoadFromFile(string filePath)
        {
            var serializer = new XmlSerializer(typeof(List<ExpenseItem>));
            using (var stream = File.OpenRead(filePath))
            {
                var loaded = (List<ExpenseItem>)serializer.Deserialize(stream);
                _items.Clear();
                if (loaded != null)
                    _items.AddRange(loaded);
            }
        }

        public void Clear()
        {
            _items.Clear();
        }
    }
}
