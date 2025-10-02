import { Plus, Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import Spinner from './Spinner'
import Toast from './Toast'

interface CreatePageProps {
  onCreatePoll: (question: string, options: string[]) => Promise<void>
}

function CreatePage({ onCreatePoll }: CreatePageProps) {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [errors, setErrors] = useState<{ question?: string; options?: string }>({})
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFormValid, setIsFormValid] = useState(false)

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, ''])
    }
  }

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const checkFormValidity = () => {
    if (!question.trim()) return false

    const filledOptions = options.filter((opt) => opt.trim())
    if (filledOptions.length < 2) return false

    const uniqueOptions = new Set(filledOptions.map((opt) => opt.trim().toLowerCase()))
    if (uniqueOptions.size !== filledOptions.length) return false

    return true
  }

  useEffect(() => {
    setIsFormValid(checkFormValidity())
  }, [question, options])

  const validateForm = () => {
    const newErrors: { question?: string; options?: string } = {}

    if (!question.trim()) {
      newErrors.question = 'Question is required'
    }

    const filledOptions = options.filter((opt) => opt.trim())
    if (filledOptions.length < 2) {
      newErrors.options = 'At least 2 options are required'
    }

    const uniqueOptions = new Set(filledOptions.map((opt) => opt.trim().toLowerCase()))
    if (uniqueOptions.size !== filledOptions.length) {
      newErrors.options = 'All options must be unique'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm() && !isCreating) {
      setIsCreating(true)
      setError(null)
      try {
        const filledOptions = options.filter((opt) => opt.trim())
        await onCreatePoll(question.trim(), filledOptions)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create poll. Please try again.')
      } finally {
        setIsCreating(false)
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          Create New Poll
          <Sparkles className="text-violet-500" size={32} />
        </h1>
        <p className="text-gray-600">Share your question with the community</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`backdrop-blur-md bg-white/40 border border-white/60 rounded-2xl p-8 shadow-xl transition-opacity ${
          isCreating ? 'opacity-60 pointer-events-none' : ''
        }`}
      >
        {/* Question Input */}
        <div className="mb-8">
          <label htmlFor="question" className="block text-sm font-semibold text-gray-700 mb-3">
            Poll Question
          </label>
          <input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What would you like to ask?"
            disabled={isCreating}
            className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 disabled:cursor-not-allowed"
          />
          {errors.question && <p className="mt-2 text-sm text-red-500">{errors.question}</p>}
        </div>

        {/* Options */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Options (2-5)</label>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  disabled={isCreating}
                  className="flex-1 px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 disabled:cursor-not-allowed"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    disabled={isCreating}
                    className="p-3 bg-red-500/20 hover:bg-red-500/30 text-red-600 rounded-xl transition-all duration-300 backdrop-blur-sm border border-red-300/50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors.options && <p className="mt-2 text-sm text-red-500">{errors.options}</p>}

          {options.length < 5 && (
            <button
              type="button"
              onClick={handleAddOption}
              disabled={isCreating}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-violet-500/20 hover:bg-violet-500/30 text-violet-700 rounded-xl transition-all duration-300 backdrop-blur-sm border border-violet-300/50 font-medium disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={18} />
              Add Option
            </button>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || isCreating}
          className={`w-full py-4 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
            isFormValid && !isCreating
              ? 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg shadow-violet-500/50 hover:shadow-xl hover:shadow-violet-500/60 transform hover:scale-[1.02]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isCreating && <Spinner size="md" />}
          {isCreating ? 'Creating Poll...' : 'Create Poll'}
        </button>
      </form>

      {error && <Toast message={error} onClose={() => setError(null)} />}
    </div>
  )
}

export default CreatePage
