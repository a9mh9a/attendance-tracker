import pandas as pd
from datetime import datetime, timedelta

# أخذ تاريخ البداية من المستخدم
start_date_str = input("أدخل أول يوم دوام (YYYY-MM-DD): ")
start_date = datetime.strptime(start_date_str, "%Y-%m-%d")

# تحديد نهاية الشهر من تاريخ البداية
end_month = start_date.month
end_year = start_date.year
if start_date.month == 12:
    next_month = datetime(end_year + 1, 1, 1)
else:
    next_month = datetime(end_year, end_month + 1, 1)

end_date = next_month - timedelta(days=1)

# قائمة لحفظ الجدول
schedule = []

current_date = start_date
day_type = "دوام"

while current_date <= end_date:
    if day_type == "دوام":
        schedule.append({"التاريخ": current_date.strftime("%Y-%m-%d"), "اليوم": "دوام"})
        # اليوم التالي مباشرة نهاية دوام (عطلة 1)
        current_date += timedelta(days=1)
        if current_date <= end_date:
            schedule.append({"التاريخ": current_date.strftime("%Y-%m-%d"), "اليوم": "عطلة"})
        # اليوم بعده عطلة 2
        current_date += timedelta(days=1)
        if current_date <= end_date:
            schedule.append({"التاريخ": current_date.strftime("%Y-%m-%d"), "اليوم": "عطلة"})
        # بعد عطلتين يرجع دوام
        current_date += timedelta(days=1)
    else:
        current_date += timedelta(days=1)

# تحويل الجدول إلى DataFrame
df = pd.DataFrame(schedule)

# حفظ الجدول إلى Excel
df.to_excel("جدول_الدوام.xlsx", index=False)

print("✅ تم إنشاء جدول الدوام وحُفظ بالملف: جدول_الدوام.xlsx")
