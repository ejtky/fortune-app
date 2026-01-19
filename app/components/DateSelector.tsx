'use client';

import React from 'react';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  label?: string;
}

export default function DateSelector({ selectedDate, onDateChange, label = "日付を選択" }: DateSelectorProps) {
  // 今日の日付を取得
  const today = new Date().toISOString().split('T')[0];

  // 1年後の日付を取得
  const oneYearLater = new Date();
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
  const maxDate = oneYearLater.toISOString().split('T')[0];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        min={today}
        max={maxDate}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
      />
      <div className="text-xs text-gray-500">
        今日から1年以内の日付を選択できます
      </div>
    </div>
  );
}
