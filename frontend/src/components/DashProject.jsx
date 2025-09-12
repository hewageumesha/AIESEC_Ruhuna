import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Alert,
  Button,
  TextInput,
  Textarea,
  Modal,
  Select,
  FileInput
} from "flowbite-react";
import { HiOutlineExclamationCircle, HiEye } from "react-icons/hi";

export default function DashProject({ currentUser }) {
  const Badge = ({ color = "gray", children, className = "" }) => {
    const colorClasses = {
      gray: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      pink: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    };

    return (
      <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${colorClasses[color]} ${className}`}>
        {children}
      </span>
    );
  };
  const RichTextEditor = ({ 
    name, 
    value, 
    onChange, 
    placeholder = "Add your comment here...",
    rows = 4
  }) => {
    const textareaRef = useRef(null);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isList, setIsList] = useState(false);
    const [isOrderedList, setIsOrderedList] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showFontSize, setShowFontSize] = useState(false);
    const [showFontFamily, setShowFontFamily] = useState(false);
    const [selectedColor, setSelectedColor] = useState("#000000");
    const [selectedFontSize, setSelectedFontSize] = useState("16px");
    const [selectedFontFamily, setSelectedFontFamily] = useState("Arial");

    const fontSizes = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px"];
    const fontFamilies = [
      { name: "Arial", value: "Arial, sans-serif" },
      { name: "Times New Roman", value: "'Times New Roman', serif" },
      { name: "Courier New", value: "'Courier New', monospace" },
      { name: "Georgia", value: "Georgia, serif" },
      { name: "Verdana", value: "Verdana, sans-serif" },
      { name: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
      { name: "Impact", value: "Impact, sans-serif" },
      { name: "Comic Sans", value: "'Comic Sans MS', cursive" },
    ];
    
    const colors = [
      "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", 
      "#FF00FF", "#00FFFF", "#FFA500", "#800080", "#FFC0CB"
    ];

    const handleFormat = (format, value = null) => {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value ? value.substring(start, end) : '';
      let newValue = value || '';

      switch(format) {
        case 'bold':
          newValue = value.substring(0, start) + 
                    `**${selectedText}**` + 
                    value.substring(end);
          setIsBold(!isBold);
          break;
        case 'italic':
          newValue = value.substring(0, start) + 
                    `*${selectedText}*` + 
                    value.substring(end);
          setIsItalic(!isItalic);
          break;
        case 'color':
          newValue = value.substring(0, start) + 
                    `[color=${selectedColor}]{${selectedText}}` + 
                    value.substring(end);
          break;
        case 'font-size':
          newValue = value.substring(0, start) + 
                    `[size=${selectedFontSize}]{${selectedText}}` + 
                    value.substring(end);
          break;
        case 'font-family':
          newValue = value.substring(0, start) + 
                    `[font=${selectedFontFamily}]{${selectedText}}` + 
                    value.substring(end);
          break;
        case 'unordered-list':
          const lines = value.split('\n');
          const currentLine = value.substring(0, start).split('\n').length - 1;
          
          if (lines[currentLine].startsWith('- ')) {
            lines[currentLine] = lines[currentLine].substring(2);
          } else {
            lines[currentLine] = '- ' + lines[currentLine];
          }
          
          newValue = lines.join('\n');
          setIsList(!isList);
          break;
        case 'ordered-list':
          const linesOrdered = value.split('\n');
          const currentLineOrdered = value.substring(0, start).split('\n').length - 1;
          
          if (linesOrdered[currentLineOrdered].match(/^\d+\. /)) {
            linesOrdered[currentLineOrdered] = linesOrdered[currentLineOrdered].replace(/^\d+\. /, '');
          } else {
            let num = 1;
            for (let i = currentLineOrdered - 1; i >= 0; i--) {
              if (linesOrdered[i].match(/^\d+\. /)) {
                const match = linesOrdered[i].match(/^(\d+)\. /);
                num = parseInt(match[1]) + 1;
                break;
              }
            }
            linesOrdered[currentLineOrdered] = `${num}. ` + linesOrdered[currentLineOrdered];
          }
          
          newValue = linesOrdered.join('\n');
          setIsOrderedList(!isOrderedList);
          break;
        default:
          break;
      }
      
      onChange({ target: { name, value: newValue } });
      
      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        let newPos = start;
        
        if (format === 'bold') newPos = selectedText ? start + 2 : start;
        if (format === 'italic') newPos = selectedText ? start + 1 : start;
        if (format === 'color' || format === 'font-size' || format === 'font-family') {
          newPos = selectedText ? start + selectedText.length + 15 : start;
        }
        
        textarea.setSelectionRange(newPos, newPos);
      }, 0);
    };

    const handleColorSelect = (color) => {
      setSelectedColor(color);
      handleFormat('color', value);
      setShowColorPicker(false);
    };

    const handleFontSizeSelect = (size) => {
      setSelectedFontSize(size);
      handleFormat('font-size', value);
      setShowFontSize(false);
    };

    const handleFontFamilySelect = (font) => {
      setSelectedFontFamily(font);
      handleFormat('font-family', value);
      setShowFontFamily(false);
    };

    return (
      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          {/* Text Formatting */}
          <div className="flex items-center mr-4 mb-2">
            <button
              type="button"
              onClick={() => handleFormat('bold', value)}
              className={`p-2 rounded mr-1 ${isBold ? 'bg-gray-200 dark:bg-gray-600' : 'hover:bg-gray-100 dark:hover:bg-gray-600'}`}
              title="Bold"
            >
              <span className="font-bold">B</span>
            </button>
            <button
              type="button"
              onClick={() => handleFormat('italic', value)}
              className={`p-2 rounded mr-1 ${isItalic ? 'bg-gray-200 dark:bg-gray-600' : 'hover:bg-gray-100 dark:hover:bg-gray-600'}`}
              title="Italic"
            >
              <span className="italic">I</span>
            </button>
          </div>

          {/* Color Picker */}
          <div className="relative mr-4 mb-2">
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
              title="Text Color"
            >
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 border border-gray-300 mr-1" 
                  style={{ backgroundColor: selectedColor }}
                ></div>
                <span>A</span>
              </div>
            </button>
            {showColorPicker && (
              <div className="absolute z-10 mt-1 p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-lg">
                <div className="grid grid-cols-5 gap-1">
                  {colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 cursor-pointer border border-gray-300"
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorSelect(color)}
                      title={color}
                    />
                  ))}
                </div>
                <div className="mt-2 flex items-center">
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Font Size */}
          <div className="relative mr-4 mb-2">
            <button
              type="button"
              onClick={() => setShowFontSize(!showFontSize)}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
              title="Font Size"
            >
              <span className="mr-1">T</span>
              <span>{selectedFontSize}</span>
            </button>
            {showFontSize && (
              <div className="absolute z-10 mt-1 p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-lg">
                {fontSizes.map((size, index) => (
                  <div
                    key={index}
                    className={`px-3 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 ${selectedFontSize === size ? 'bg-blue-100 dark:bg-blue-800' : ''}`}
                    onClick={() => handleFontSizeSelect(size)}
                    style={{ fontSize: size }}
                  >
                    {size}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Font Family */}
          <div className="relative mr-4 mb-2">
            <button
              type="button"
              onClick={() => setShowFontFamily(!showFontFamily)}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
              title="Font Family"
            >
              <span className="mr-1">F</span>
              <span>{selectedFontFamily}</span>
            </button>
            {showFontFamily && (
              <div className="absolute z-10 mt-1 p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-lg max-h-60 overflow-y-auto">
                {fontFamilies.map((font, index) => (
                  <div
                    key={index}
                    className={`px-3 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 ${selectedFontFamily === font.value ? 'bg-blue-100 dark:bg-blue-800' : ''}`}
                    onClick={() => handleFontFamilySelect(font.value)}
                    style={{ fontFamily: font.value }}
                  >
                    {font.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lists */}
          <div className="flex items-center mr-4 mb-2">
            <button
              type="button"
              onClick={() => handleFormat('unordered-list', value)}
              className={`p-2 rounded mr-1 ${isList ? 'bg-gray-200 dark:bg-gray-600' : 'hover:bg-gray-100 dark:hover:bg-gray-600'}`}
              title="Unordered List"
            >
              <span>• List</span>
            </button>
            <button
              type="button"
              onClick={() => handleFormat('ordered-list', value)}
              className={`p-2 rounded mr-1 ${isOrderedList ? 'bg-gray-200 dark:bg-gray-600' : 'hover:bg-gray-100 dark:hover:bg-gray-600'}`}
              title="Ordered List"
            >
              <span>1. List</span>
            </button>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 ml-auto mb-2">
            Markdown is supported
          </div>
        </div>
        
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 focus:outline-none resize-y"
        />
      </div>
    );
  };

  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "iGV",
    logo: "",
    overview: "",
    description: "",
    links: [{ topic: "", url: "" }],
    sdgFocus: "",
    opportunityLinks: [{ topic: "", url: "" }],
    projectBooklets: [{ topic: "", url: "" }],
    projectFee: "",
    availableSlots: [],
    logistics: {
      accommodation: "",
      transportation: "",
      meals: "",
      computer: ""
    },
    eligibility: {
      age: "",
      languages: "",
      gender: ""
    },
    role: "",
    projectActivities: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

   const fetchProjects = async () => {
    try {
      const res = await axios.get("https://aiesecruhuna-production.up.railway.app/api/projects/", {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      setProjects(res.data);
      setErrorMsg("");
    } catch (err) {
      console.error("Full error:", err);
      
      if (err.response) {
        setErrorMsg(`Server error: ${err.response.status} - ${err.response.data || 'Check security config'}`);
      } else if (err.request) {
        setErrorMsg("Network error: Backend not running on port 8080?");
      } else {
        setErrorMsg(`Error: ${err.message}`);
      }
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (field, index, key, value) => {
    const newArray = [...formData[field]];
    newArray[index][key] = value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const addArrayField = (field, defaultValue = { topic: "", url: "" }) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], defaultValue]
    }));
  };

  const removeArrayField = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const handleLogoChange = (e) => {
    setFormData((prev) => ({ ...prev, logo: [...e.target.files] }));
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...formData.links];
    newLinks[index][field] = value;
    setFormData((prev) => ({ ...prev, links: newLinks }));
  };

  const addLinkField = () => {
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { topic: "", url: "" }],
    }));
  };

  const removeLinkField = (index) => {
    const newLinks = formData.links.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, links: newLinks }));
  };

  const handleSubmit = async () => {
  try {
      const token = localStorage.getItem('authToken');

      const userRole = localStorage.getItem('userRole');
      if (!userRole || (userRole !== 'LCP' && userRole !== 'LCVP')) {
        setErrorMsg("You don't have permission to manage projects");
        return;
      }

    const linksObject = {};
    if (formData.links && Array.isArray(formData.links)) {
      formData.links.forEach((link) => {
        if (link.topic && link.url) {
          linksObject[link.topic] = link.url;
        }
      });
    }

    const payload = {
      ...formData,
      links: linksObject,
      opportunityLinks: formData.opportunityLinks || [],
      projectBooklets: formData.projectBooklets || [],
      availableSlots: formData.availableSlots || [],
    };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || payload[key] === null) {
        delete payload[key];
      }
    });

    console.log("Payload:", JSON.stringify(payload, null, 2)); // Debug: Log payload
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Ensure correct format
      },
      // withCredentials: true, // Uncomment only if using cookies
    };

    let response;
    if (editingId) {
      response = await axios.put(
        `https://aiesecruhuna-production.up.railway.app/api/projects/update/${editingId}`,
        payload,
        config
      );
    } else {
      response = await axios.post(
        "https://aiesecruhuna-production.up.railway.app/api/projects/add",
        payload,
        config
      );
    }

    console.log("API Response:", response.data);
    setSuccessMsg(editingId ? "Project updated successfully!" : "Project added successfully!");
    resetForm();
    fetchProjects();
  } catch (err) {
    console.error("Full error:", err);
    console.error("Error response:", err.response);
    if (err.response) {
      setErrorMsg(`Error: ${err.response.status} - ${err.response.data?.message || 'Server error'}`);
    } else if (err.request) {
      setErrorMsg("Network error: Could not connect to server. Is the backend running?");
    } else {
      setErrorMsg(`Error: ${err.message}`);
    }
  }
};

  const resetForm = () => {
    setFormData({
      name: "",
      type: "iGV",
      logo: "",
      overview: "",
      description: "",
      links: [{ topic: "", url: "" }],
      sdgFocus: "",
      opportunityLinks: [{ topic: "", url: "" }],
      projectBooklets: [{ topic: "", url: "" }],
      projectFee: "",
      availableSlots: [],
      logistics: {
        accommodation: "",
        transportation: "",
        meals: "",
        computer: ""
      },
      eligibility: {
        age: "",
        languages: "",
        gender: ""
      },
      role: "",
      projectActivities: ""
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (project) => {
    // Convert links object to array
    const linksArray = project.links
      ? Object.entries(project.links).map(([topic, url]) => ({ topic, url }))
      : [{ topic: "", url: "" }];

    // Convert opportunityLinks object to array
    const opportunityLinksArray = project.opportunityLinks
      ? Object.entries(project.opportunityLinks).map(([topic, url]) => ({ topic, url }))
      : [{ topic: "", url: "" }];

    // Convert projectBooklets object to array
    const projectBookletsArray = project.projectBooklets
      ? Object.entries(project.projectBooklets).map(([topic, url]) => ({ topic, url }))
      : [{ topic: "", url: "" }];

    setFormData({
      name: project.name,
      type: project.type || "iGV",
      logo: project.logo || "",
      overview: project.overview || "",
      description: project.description || "",
      links: linksArray,
      sdgFocus: project.sdgFocus || "",
      opportunityLinks: opportunityLinksArray,
      projectBooklets: projectBookletsArray,
      projectFee: project.projectFee || "",
      availableSlots: project.availableSlots || [],
      logistics: project.logistics || {
        accommodation: "",
        transportation: "",
        meals: "",
        computer: ""
      },
      eligibility: project.eligibility || {
        age: "",
        languages: "",
        gender: ""
      },
      role: project.role || "",
      projectActivities: project.projectActivities || ""
    });

    setEditingId(project.id);
    setShowForm(true);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `https://aiesecruhuna-production.up.railway.app/api/projects/delete/${deleteId}`
      );
      setSuccessMsg("Project deleted successfully!");
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      setErrorMsg("Error deleting project!");
      setShowModal(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id]
    );
  };

  const handlePublishToggle = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.patch(
        `https://aiesecruhuna-production.up.railway.app/api/projects/publish/${id}`,
        { published: !currentStatus },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          }
        }
      );
      
      setSuccessMsg(`Project ${!currentStatus ? 'published' : 'unpublished'} successfully!`);
      fetchProjects();
    } catch (err) {
      setErrorMsg("Error updating publish status!");
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Project Management
      </h1>

      {/* Add Project Button */}
      <div className="flex justify-start mb-6">
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "Add Project"}
        </Button>
      </div>

      {/* Add/Edit Form (hidden until button is clicked) */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 mb-8 overflow-y-auto max-h-screen">
          <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">
            {editingId ? "Edit Project" : "Add Project"}
          </h2>

          {/* Name + Type + Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Project Name
              </label>
              <TextInput
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter project name"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Type
              </label>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="iGV">iGV</option>
                <option value="iGTa">iGTa/e</option>
              </Select>
            </div>
          </div>

          {/* Project Logo */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Project Logo
            </label>
            <FileInput multiple onChange={handleLogoChange} />
          </div>

          {/* Overview */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Overview
            </label>
            <RichTextEditor
              name="overview"
              value={formData.overview}
              onChange={handleChange}
              placeholder="Project overview..."
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <RichTextEditor
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Project description..."
            />
          </div>

          {/* SDG Focus */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              SDG Focus
            </label>
            <TextInput
              name="sdgFocus"
              value={formData.sdgFocus}
              onChange={handleChange}
              placeholder="SDG focus (e.g., SDG 4 - Quality Education)"
            />
          </div>

          {/* Project Fee */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Project Fee
            </label>
            <TextInput
              name="projectFee"
              value={formData.projectFee}
              onChange={handleChange}
              placeholder="Project fee (e.g., 120 USD)"
            />
          </div>

          {/* Opportunity Links */}
          <div className="mb-4">
            <h3 className="font-medium mb-2 dark:text-gray-200">Opportunity Links</h3>
            {formData.opportunityLinks.map((link, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <TextInput
                  placeholder="Topic"
                  value={link.topic}
                  onChange={(e) => handleArrayChange("opportunityLinks", index, "topic", e.target.value)}
                  className="flex-1"
                />
                <TextInput
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => handleArrayChange("opportunityLinks", index, "url", e.target.value)}
                  className="flex-2"
                />
                <Button color="failure" onClick={() => removeArrayField("opportunityLinks", index)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button color="info" onClick={() => addArrayField("opportunityLinks")}>
              + Add Opportunity Link
            </Button>
          </div>

          {/* Project Booklets */}
          <div className="mb-4">
            <h3 className="font-medium mb-2 dark:text-gray-200">Project Booklets</h3>
            {formData.projectBooklets.map((booklet, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <TextInput
                  placeholder="Topic"
                  value={booklet.topic}
                  onChange={(e) => handleArrayChange("projectBooklets", index, "topic", e.target.value)}
                  className="flex-1"
                />
                <TextInput
                  placeholder="URL"
                  value={booklet.url}
                  onChange={(e) => handleArrayChange("projectBooklets", index, "url", e.target.value)}
                  className="flex-2"
                />
                <Button color="failure" onClick={() => removeArrayField("projectBooklets", index)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button color="info" onClick={() => addArrayField("projectBooklets")}>
              + Add Project Booklet
            </Button>
          </div>

          {/* Available Slots */}
          <div className="mb-4">
            <h3 className="font-medium mb-2 dark:text-gray-200">Available Slots</h3>
            {formData.availableSlots.map((slot, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <TextInput
                  placeholder="Available slot (e.g., May 1 - June 12)"
                  value={slot}
                  onChange={(e) => handleArrayChange("availableSlots", index, e.target.value)}
                  className="flex-grow"
                />
                <Button color="failure" onClick={() => removeArrayField("availableSlots", index)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button color="info" onClick={() => addArrayField("availableSlots", "")}>
              + Add Available Slot
            </Button>
          </div>

          {/* Logistics */}
          <div className="mb-4 p-4 border rounded-md">
            <h3 className="font-medium mb-2 dark:text-gray-200">Logistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Accommodation
                </label>
                <TextInput
                  value={formData.logistics.accommodation}
                  onChange={(e) => handleNestedChange("logistics", "accommodation", e.target.value)}
                  placeholder="Accommodation details"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Transportation
                </label>
                <TextInput
                  value={formData.logistics.transportation}
                  onChange={(e) => handleNestedChange("logistics", "transportation", e.target.value)}
                  placeholder="Transportation details"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Meals
                </label>
                <TextInput
                  value={formData.logistics.meals}
                  onChange={(e) => handleNestedChange("logistics", "meals", e.target.value)}
                  placeholder="Meals details"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Computer
                </label>
                <TextInput
                  value={formData.logistics.computer}
                  onChange={(e) => handleNestedChange("logistics", "computer", e.target.value)}
                  placeholder="Computer details"
                />
              </div>
            </div>
          </div>

          {/* Eligibility */}
          <div className="mb-4 p-4 border rounded-md">
            <h3 className="font-medium mb-2 dark:text-gray-200">Eligibility</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Age
                </label>
                <TextInput
                  value={formData.eligibility.age}
                  onChange={(e) => handleNestedChange("eligibility", "age", e.target.value)}
                  placeholder="Age requirements"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Languages
                </label>
                <TextInput
                  value={formData.eligibility.languages}
                  onChange={(e) => handleNestedChange("eligibility", "languages", e.target.value)}
                  placeholder="Language requirements"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gender
                </label>
                <Select
                  name="gender"
                  value={formData.eligibility.gender}
                  onChange={(e) => handleNestedChange("eligibility", "gender", e.target.value)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="both">Both</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Role
            </label>
            <Textarea
              rows={3}
              value={formData.role}
              onChange={handleChange}
              placeholder="Role description"
            />
          </div>

          {/* Project Activities */}
          <div className="mb-4">
            <h3 className="font-medium mb-2 dark:text-gray-200">Project Activities</h3>
            <RichTextEditor
              name="projectActivities"
              value={formData.projectActivities}
              onChange={handleChange}
              placeholder="Project activity description"
            />
          </div>

          {/* Links */}
          <div className="mb-4">
            <h3 className="font-medium mb-2 dark:text-gray-200">Additional Links</h3>
            {formData.links.map((link, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <TextInput
                  placeholder="Topic"
                  value={link.topic}
                  onChange={(e) =>
                    handleLinkChange(index, "topic", e.target.value)
                  }
                />
                <TextInput
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                />
                {index > 0 && (
                  <Button color="failure" onClick={() => removeLinkField(index)}>
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button color="info" onClick={addLinkField}>
              + Add Link
            </Button>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <Button color="light" onClick={resetForm}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingId ? "Update" : "Add"}
            </Button>
          </div>

          {successMsg && (
            <Alert color="success" className="mt-4">
              {successMsg}
            </Alert>
          )}
          {errorMsg && (
            <Alert color="failure" className="mt-4">
              {errorMsg}
            </Alert>
          )}
        </div>
      )}

      {/* Projects Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">
          Projects List
        </h2>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {projects.map((p) => (
              <React.Fragment key={p.id}>
                <tr
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => toggleExpand(p.id)}
                >
                  <td className="px-6 py-4 text-sm">{p.id}</td>
                  <td className="px-6 py-4 text-sm">{p.name}</td>
                  <td className="px-6 py-4 text-sm">{p.type}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge color={p.published ? "success" : "warning"}>
                      {p.published ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button
                        color={p.published ? "gray" : "success"}
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePublishToggle(p.id, p.published);
                        }}
                      >
                        {p.published ? <HiEyeOff className="mr-1" /> : <HiEye className="mr-1" />}
                        {p.published ? "Unpublish" : "Publish"}
                      </Button>
                      <Button
                        color="warning"
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(p);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        color="failure"
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(p.id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
                {expandedRows.includes(p.id) && (
                  <tr className="bg-gray-50 dark:bg-gray-900">
                    <td colSpan="5" className="px-6 py-4">
                      <p>
                        <strong>Type:</strong> {p.type}
                      </p>
                      <p>
                        <strong>Overview:</strong> {p.overview}
                      </p>
                      <p>
                        <strong>Description:</strong> {p.description}
                      </p>
                      <p>
                        <strong>Dates:</strong> {p.startDate} - {p.endDate}
                      </p>
                      <p>
                        <strong>SDG Focus:</strong> {p.sdgFocus}
                      </p>
                      <p>
                        <strong>Project Fee:</strong> {p.projectFee}
                      </p>
                      
                      {p.opportunityLinks && Object.keys(p.opportunityLinks).length > 0 && (
                        <div className="mt-2">
                          <strong>Opportunity Links:</strong>
                          <ul className="list-disc ml-6">
                            {Object.entries(p.opportunityLinks).map(([topic, url], i) => (
                              <li key={i}>
                                <strong>{topic}:</strong>{" "}
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-500"
                                >
                                  {url}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {p.projectBooklets && Object.keys(p.projectBooklets).length > 0 && (
                        <div className="mt-2">
                          <strong>Project Booklets:</strong>
                          <ul className="list-disc ml-6">
                            {Object.entries(p.projectBooklets).map(([topic, url], i) => (
                              <li key={i}>
                                <strong>{topic}:</strong>{" "}
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-500"
                                >
                                  {url}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {p.availableSlots && p.availableSlots.length > 0 && (
                        <div className="mt-2">
                          <strong>Available Slots:</strong>
                          <ul className="list-disc ml-6">
                            {p.availableSlots.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {p.logistics && (
                        <div className="mt-2">
                          <strong>Logistics:</strong>
                          <ul className="list-disc ml-6">
                            <li>Accommodation: {p.logistics.accommodation}</li>
                            <li>Transportation: {p.logistics.transportation}</li>
                            <li>Meals: {p.logistics.meals}</li>
                            <li>Computer: {p.logistics.computer}</li>
                          </ul>
                        </div>
                      )}
                      
                      {p.eligibility && (
                        <div className="mt-2">
                          <strong>Eligibility:</strong>
                          <ul className="list-disc ml-6">
                            <li>Age: {p.eligibility.age}</li>
                            <li>Languages: {p.eligibility.languages}</li>
                            <li>Gender: {p.eligibility.gender}</li>
                          </ul>
                        </div>
                      )}

                      <p>
                        <strong>Role:</strong> {p.role}
                      </p>
                      
                      {p.projectActivities && p.projectActivities.length > 0 && (
                        <div className="mt-2">
                          <strong>Project Activities:</strong>
                          <ul className="list-disc ml-6">
                            {p.projectActivities.map((a, i) => (
                              <li key={i}>{a}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="mt-2">
                        <strong>Links:</strong>
                        <ul className="list-disc ml-6">
                          {p.links && Object.entries(p.links).map(([topic, url], i) => (
                            <li key={i}>
                              <strong>{topic}:</strong>{" "}
                              <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-500"
                              >
                                {url}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      <Modal
        show={showModal}
        size="md"
        onClose={() => setShowModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this project?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={confirmDelete}>
                Yes, delete
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}