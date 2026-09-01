'use client';

import React, { useState } from 'react';
import { BookOpenCheck, DollarSign, Edit, Plus, CheckCircle, ShieldCheck } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function AdminCoursesPage() {
  const { courses } = useAppStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [successMsg, setSuccessMsg] = useState('');

  const handleUpdatePrice = (courseId: string) => {
    // Demo price update
    setSuccessMsg(`Price updated successfully for Course ID ${courseId}. Synced to all public pages.`);
    setEditingId(null);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.875rem', color: '#0F172A', marginBottom: '6px' }}>
          Centralized Course Catalogue & Single-Source Pricing
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Single point of configuration for course fees, durations, and LMS syllabus contents according to PRD Rule 359.
        </p>
      </div>

      {successMsg && (
        <div
          style={{
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            borderRadius: '10px',
            padding: '14px 18px',
            color: '#065F46',
            fontSize: '0.875rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <CheckCircle size={18} color="#10B981" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="card" style={{ backgroundColor: '#FFFFFF', padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
              <th style={{ padding: '14px 18px' }}>Course Title</th>
              <th style={{ padding: '14px 18px' }}>Target Exam</th>
              <th style={{ padding: '14px 18px' }}>Duration</th>
              <th style={{ padding: '14px 18px' }}>Centralized Price</th>
              <th style={{ padding: '14px 18px' }}>Students</th>
              <th style={{ padding: '14px 18px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '16px 18px', fontWeight: 600, color: '#0F172A' }}>
                  {course.title}
                </td>
                <td style={{ padding: '16px 18px' }}>
                  <span className="badge badge-blue">{course.targetExam}</span>
                </td>
                <td style={{ padding: '16px 18px', color: '#64748B' }}>
                  {course.durationHours} Hours
                </td>
                <td style={{ padding: '16px 18px', fontWeight: 700, color: '#0F172A', fontSize: '1rem' }}>
                  {editingId === course.id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>$</span>
                      <input
                        type="number"
                        className="form-input"
                        style={{ width: '90px', padding: '4px 8px' }}
                        defaultValue={course.price}
                        onChange={(e) => setNewPrice(Number(e.target.value))}
                      />
                      <button
                        onClick={() => handleUpdatePrice(course.id)}
                        className="btn-primary"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <span>${course.price}</span>
                  )}
                </td>
                <td style={{ padding: '16px 18px', color: '#334155' }}>
                  {course.studentsCount} Enrolled
                </td>
                <td style={{ padding: '16px 18px' }}>
                  <button
                    onClick={() => {
                      setEditingId(course.id);
                      setNewPrice(course.price);
                    }}
                    className="btn-outline"
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  >
                    Edit Price
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
