import React, { useState } from 'react';
import {
  HelpCircle,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Eye,
  ListPlus,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { CustomRsvpQuestion, QuestionType } from '../../types/wedding';

interface CustomQuestionsManagerProps {
  onClose?: () => void;
}

export const CustomQuestionsManager: React.FC<CustomQuestionsManagerProps> = ({ onClose }) => {
  const {
    currentWedding,
    events,
    customQuestions,
    addCustomQuestion,
    updateCustomQuestion,
    deleteCustomQuestion,
  } = useWedding();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Form State
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState<QuestionType>('yes_no');
  const [selectedEventId, setSelectedEventId] = useState<string>(''); // empty = all events
  const [isRequired, setIsRequired] = useState(false);
  const [options, setOptions] = useState<string[]>(['Option 1', 'Option 2']);
  const [newOptionText, setNewOptionText] = useState('');

  const weddingQuestions = customQuestions.filter((q) => q.weddingId === currentWedding.weddingId);

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setQuestionText('');
    setQuestionType('yes_no');
    setSelectedEventId('');
    setIsRequired(false);
    setOptions(['Option 1', 'Option 2']);
  };

  const handleStartEdit = (q: CustomRsvpQuestion) => {
    setEditingId(q.questionId);
    setIsAdding(false);
    setQuestionText(q.questionText);
    setQuestionType(q.questionType);
    setSelectedEventId(q.eventId || '');
    setIsRequired(q.isRequired);
    setOptions(q.options && q.options.length > 0 ? q.options : ['Option 1', 'Option 2']);
  };

  const handleAddOption = () => {
    if (!newOptionText.trim()) return;
    setOptions([...options, newOptionText.trim()]);
    setNewOptionText('');
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    const payload = {
      questionText: questionText.trim(),
      questionType,
      eventId: selectedEventId || undefined,
      isRequired,
      options: questionType === 'multiple_choice' ? options.filter((o) => o.trim().length > 0) : undefined,
    };

    if (editingId) {
      updateCustomQuestion(editingId, payload);
      setEditingId(null);
    } else {
      addCustomQuestion(payload);
      setIsAdding(false);
    }
  };

  const getTypeBadge = (type: QuestionType) => {
    switch (type) {
      case 'yes_no':
        return <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold">Yes / No</span>;
      case 'multiple_choice':
        return <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-semibold">Multiple Choice</span>;
      case 'short_answer':
        return <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-semibold">Short Text</span>;
      case 'number':
        return <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold">Number</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5C378]/70 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5C378]/40 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FAF0D4] border border-[#E5C378] text-[#800020] flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-[#800020]">
              Custom RSVP Questions
            </h3>
          </div>
          <p className="text-xs text-[#6B5E55] mt-1">
            Collect special details from guests (e.g. hotel accommodation, airport transfers, song suggestions, special requests).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreviewModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-[#800020] bg-[#FAF0D4] hover:bg-[#F5E3B5] border border-[#E5C378] rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Form</span>
          </button>
          {!isAdding && !editingId && (
            <button
              onClick={handleStartAdd}
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#800020] to-[#990000] hover:from-[#6B081B] hover:to-[#800020] rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#FDE047]" />
              <span>Add Question</span>
            </button>
          )}
        </div>
      </div>

      {/* Add / Edit Form */}
      {(isAdding || editingId) && (
        <form onSubmit={handleSave} className="p-5 bg-[#FAF7F2] rounded-xl border border-[#E5C378] space-y-4 text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-[#800020]">
              {editingId ? 'Edit RSVP Question' : 'Create New RSVP Question'}
            </h4>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="p-1 text-[#6B5E55] hover:text-[#800020]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block font-semibold text-[#3D291F] mb-1">
              Question Text *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Will you need hotel accommodation in Jaipur?"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-lg focus:outline-hidden focus:border-[#800020]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#3D291F] mb-1">
                Answer Format
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-lg focus:outline-hidden focus:border-[#800020]"
              >
                <option value="yes_no">Yes / No</option>
                <option value="multiple_choice">Multiple Choice</option>
                <option value="short_answer">Short Text Answer</option>
                <option value="number">Number</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#3D291F] mb-1">
                Ceremony Assignment
              </label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-lg focus:outline-hidden focus:border-[#800020]"
              >
                <option value="">All Ceremonies (Global)</option>
                {events.map((ev) => (
                  <option key={ev.eventId} value={ev.eventId}>
                    {ev.eventName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#3D291F] mb-1">
                Requirement
              </label>
              <button
                type="button"
                onClick={() => setIsRequired(!isRequired)}
                className={`w-full px-3 py-2 rounded-lg border flex items-center justify-between font-semibold transition-colors ${
                  isRequired
                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                    : 'bg-white text-[#5C4D43] border-[#E5C378]'
                }`}
              >
                <span>{isRequired ? 'Required Question' : 'Optional Question'}</span>
                {isRequired ? (
                  <ToggleRight className="w-5 h-5 text-amber-600" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Multiple Choice Options Builder */}
          {questionType === 'multiple_choice' && (
            <div className="p-3 bg-white rounded-lg border border-[#E5C378]/60 space-y-2">
              <label className="block font-semibold text-[#3D291F]">
                Answer Options:
              </label>
              <div className="space-y-1.5">
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-5 text-center font-mono text-[#8C7A70]">{idx + 1}.</span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const copy = [...options];
                        copy[idx] = e.target.value;
                        setOptions(copy);
                      }}
                      className="flex-1 px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E5C378] rounded-md text-xs"
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        className="p-1 text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add another option..."
                  value={newOptionText}
                  onChange={(e) => setNewOptionText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddOption();
                    }
                  }}
                  className="flex-1 px-2.5 py-1.5 bg-white border border-[#E5C378] rounded-md text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="px-3 py-1.5 bg-[#FAF0D4] hover:bg-[#F5E3B5] text-[#800020] font-semibold rounded-md border border-[#E5C378]"
                >
                  Add Option
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#800020] hover:bg-[#6B081B] text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{editingId ? 'Update Question' : 'Save Question'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Questions List */}
      {weddingQuestions.length === 0 ? (
        <div className="text-center py-10 bg-[#FAF7F2] rounded-xl border border-dashed border-[#E5C378] p-6 space-y-3">
          <HelpCircle className="w-10 h-10 text-[#B45309] mx-auto opacity-60" />
          <h4 className="font-bold text-sm text-[#3D291F]">No Custom Questions Yet</h4>
          <p className="text-xs text-[#6B5E55] max-w-sm mx-auto">
            Add custom questions to ask guests about accommodation, transport, song requests, or kids facilities.
          </p>
          <button
            onClick={handleStartAdd}
            className="px-4 py-2 text-xs font-bold text-white bg-[#800020] hover:bg-[#6B081B] rounded-xl shadow-xs"
          >
            + Create First Question
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {weddingQuestions.map((q, idx) => {
            const assignedEvent = events.find((e) => e.eventId === q.eventId);
            return (
              <div
                key={q.questionId}
                className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5C378]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-[#D4AF37] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-5 h-5 rounded-full bg-[#800020] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <strong className="text-[#3D291F] text-sm">{q.questionText}</strong>
                    {q.isRequired && (
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-bold">
                        Required
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[#6B5E55] pl-7">
                    {getTypeBadge(q.questionType)}
                    <span>·</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3 text-[#800020]" />
                      {assignedEvent ? assignedEvent.eventName : 'All Ceremonies'}
                    </span>
                    {q.options && q.options.length > 0 && (
                      <>
                        <span>·</span>
                        <span>{q.options.length} options</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleStartEdit(q)}
                    className="p-1.5 text-[#5C4D43] hover:text-[#800020] bg-white rounded-lg border border-[#E5C378] hover:bg-[#FAF0D4] transition-colors"
                    title="Edit Question"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteCustomQuestion(q.questionId)}
                    className="p-1.5 text-rose-600 hover:text-rose-800 bg-white rounded-lg border border-rose-200 hover:bg-rose-50 transition-colors"
                    title="Delete Question"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Live Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] rounded-2xl border-2 border-[#E5C378] shadow-2xl p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-4 right-4 p-1 text-[#6B5E55] hover:text-[#800020]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-[#800020]" />
              <h3 className="font-serif-luxury text-lg font-bold text-[#800020]">
                Live Guest RSVP Preview
              </h3>
            </div>
            <p className="text-xs text-[#6B5E55] mb-5">
              This is how your custom questions appear to invited guests inside their personal invitation pass:
            </p>

            <div className="space-y-4 bg-white p-5 rounded-xl border border-[#E5C378]">
              {weddingQuestions.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No custom questions added yet.</p>
              ) : (
                weddingQuestions.map((q) => {
                  const ev = events.find((e) => e.eventId === q.eventId);
                  return (
                    <div key={q.questionId} className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-[#3D291F]">
                          {q.questionText} {q.isRequired && <span className="text-rose-600">*</span>}
                        </label>
                        {ev && (
                          <span className="text-[10px] text-[#B45309] bg-[#FAF0D4] px-1.5 py-0.5 rounded font-medium">
                            {ev.eventName}
                          </span>
                        )}
                      </div>

                      {q.questionType === 'yes_no' && (
                        <div className="flex gap-3">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input type="radio" name={q.questionId} defaultChecked className="accent-[#800020]" />
                            <span>Yes</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input type="radio" name={q.questionId} className="accent-[#800020]" />
                            <span>No</span>
                          </label>
                        </div>
                      )}

                      {q.questionType === 'multiple_choice' && (
                        <select className="w-full p-2 bg-[#FAF7F2] border border-[#E5C378] rounded-md text-xs">
                          {q.options?.map((opt, i) => (
                            <option key={i} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}

                      {q.questionType === 'short_answer' && (
                        <input
                          type="text"
                          placeholder="Your answer..."
                          className="w-full px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E5C378] rounded-md text-xs"
                        />
                      )}

                      {q.questionType === 'number' && (
                        <input
                          type="number"
                          defaultValue={0}
                          min={0}
                          className="w-24 px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E5C378] rounded-md text-xs font-mono"
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-4">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="w-full py-2.5 bg-[#800020] text-white font-bold rounded-xl text-xs hover:bg-[#6B081B]"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
