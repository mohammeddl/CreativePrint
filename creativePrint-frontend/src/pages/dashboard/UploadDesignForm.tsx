import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Upload, X, Info, ArrowLeft, Check } from "lucide-react"
import { api } from "../../components/services/api/axios"
import toast from "react-hot-toast"

export default function UploadDesignForm() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  })
  const [designFile, setDesignFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ 
        ...prev, 
        file: "Invalid file type. Please upload JPEG, PNG, SVG, or PDF files." 
      }))
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ 
        ...prev, 
        file: "File is too large. Maximum size is 5MB." 
      }))
      return
    }

    setDesignFile(file)
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors.file
      return newErrors
    })

    // Create preview for image files
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      // For PDF files, use a placeholder
      setPreviewUrl('/pdf-placeholder.svg')
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.add('border-purple-500', 'bg-purple-50')
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('border-purple-500', 'bg-purple-50')
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-purple-500', 'bg-purple-50')
    
    if (e.dataTransfer.files?.length) {
      const file = e.dataTransfer.files[0]
      
      // Mock the change event
      const changeEvent = {
        target: {
          files: [file]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>
      
      handleFileChange(changeEvent)
    }
  }

  const clearFile = () => {
    setDesignFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Design name is required"
    }
    
    if (!designFile) {
      newErrors.file = "Design file is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Create FormData for file upload
      const designFormData = new FormData()
      designFormData.append("name", formData.name)
      designFormData.append("description", formData.description)
      if (designFile) {
        designFormData.append("designFile", designFile)
      }
      
      // Upload design to server
      const response = await api.post("/partner/designs", designFormData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      
      toast.success("Design uploaded successfully!")
      navigate("/dashboard/designs")
    } catch (error: any) {
      console.error("Error uploading design:", error)
      
      if (error.response?.data) {
        // Handle validation errors from server
        const serverErrors = error.response.data
        
        if (typeof serverErrors === 'object') {
          setErrors(serverErrors)
        } else {
          toast.error(error.response.data.message || "Failed to upload design")
        }
      } else {
        toast.error("Failed to upload design. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/dashboard/designs')}
          className="p-2 mr-4 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Upload New Design</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Design Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`block w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              placeholder="Enter design name"
              maxLength={100}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter design description (optional)"
              maxLength={1000}
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.description.length}/1000 characters
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Design File*
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 ${
                errors.file ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } text-center cursor-pointer transition-colors duration-200`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".jpg,.jpeg,.png,.svg,.pdf"
                onChange={handleFileChange}
              />
              
              {previewUrl ? (
                <div className="space-y-4">
                  <div className="relative mx-auto max-w-xs">
                    <img 
                      src={previewUrl} 
                      alt="Design preview" 
                      className="max-h-48 mx-auto object-contain"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        clearFile()
                      }}
                      className="absolute -top-3 -right-3 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    {designFile?.name} ({designFile && (designFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                  <p className="text-xs text-purple-600">
                    Click to change file
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100">
                    <Upload className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      Drag and drop your design file here, or click to browse
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports JPG, PNG, SVG, PDF (max 5MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
            {errors.file && (
              <p className="mt-1 text-sm text-red-600">{errors.file}</p>
            )}
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex">
            <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5 mr-3" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Design Requirements:</p>
              <ul className="space-y-1 list-disc pl-5">
                <li>Preferred formats: PNG, SVG (best for scaling)</li>
                <li>For best results, upload high-resolution files</li>
                <li>Make sure you have rights to use the design</li>
                <li>Avoid designs with many small details that might not print well</li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/designs')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  <span>Upload Design</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}