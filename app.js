// Global variables
let curriculumData = null;
let recentMessages = [];

// DOM elements
const elements = {
    form: document.getElementById('batchForm'),
    trainingDate: document.getElementById('trainingDate'),
    instructorName: document.getElementById('instructorName'),
    batchName: document.getElementById('batchName'),
    presentStudents: document.getElementById('presentStudents'),
    totalStudents: document.getElementById('totalStudents'),
    attendancePercent: document.getElementById('attendancePercent'),
    trainingMode: document.getElementById('trainingMode'),
    course: document.getElementById('course'),
    courseModule: document.getElementById('courseModule'),
    mainTopicDisplay: document.getElementById('mainTopicDisplay'),
    subtopicSearch: document.getElementById('subtopicSearch'),
    selectAllBtn: document.getElementById('selectAllBtn'),
    clearAllBtn: document.getElementById('clearAllBtn'),
    subtopicsContainer: document.getElementById('subtopicsContainer'),
    additionalNotes: document.getElementById('additionalNotes'),
    generateBtn: document.getElementById('generateBtn'),
    resetBtn: document.getElementById('resetBtn'),
    messagePreview: document.getElementById('messagePreview'),
    previewActions: document.getElementById('previewActions'),
    copyBtn: document.getElementById('copyBtn'),
    whatsappBtn: document.getElementById('whatsappBtn'),
    recentUpdates: document.getElementById('recentUpdates')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Set default date to today
        elements.trainingDate.value = new Date().toISOString().split('T')[0];
        
        // Load curriculum data from YAML
        await loadCurriculumData();
        
        // Load saved preferences
        loadSavedPreferences();
        
        // Load recent messages
        loadRecentMessages();
        
        // Set up event listeners
        setupEventListeners();
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
        showError('Failed to load application. Please refresh the page.');
    }
});

// Load curriculum data from YAML file
async function loadCurriculumData() {
    try {
        const response = await fetch('/data/cdec-ai-topics.yaml');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const yamlText = await response.text();
        curriculumData = jsyaml.load(yamlText);
        
        // Populate course dropdown
        populateCourseDropdown();
        
        console.log('Curriculum data loaded successfully');
    } catch (error) {
        console.error('Error loading curriculum data:', error);
        throw error;
    }
}

// Populate course dropdown from YAML data
function populateCourseDropdown() {
    elements.course.innerHTML = '<option value="">Select course</option>';
    
    if (curriculumData && curriculumData.topics) {
        curriculumData.topics.forEach(topic => {
            const option = document.createElement('option');
            option.value = topic.name;
            option.textContent = topic.name;
            elements.course.appendChild(option);
        });
    }
}

// Set up all event listeners
function setupEventListeners() {
    // Course change handler
    elements.course.addEventListener('change', handleCourseChange);
    
    // Course module change handler
    elements.courseModule.addEventListener('change', handleCourseModuleChange);
    
    // Attendance calculation
    elements.presentStudents.addEventListener('input', calculateAttendance);
    elements.totalStudents.addEventListener('input', calculateAttendance);
    
    // Subtopic search
    elements.subtopicSearch.addEventListener('input', filterSubtopics);
    
    // Select all/Clear all buttons
    elements.selectAllBtn.addEventListener('click', selectAllSubtopics);
    elements.clearAllBtn.addEventListener('click', clearAllSubtopics);
    
    // Form actions
    elements.generateBtn.addEventListener('click', generateMessage);
    elements.resetBtn.addEventListener('click', resetForm);
    elements.copyBtn.addEventListener('click', copyMessage);
    elements.whatsappBtn.addEventListener('click', shareOnWhatsApp);
    
    // Form validation on input
    const formInputs = elements.form.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', validateForm);
        input.addEventListener('change', validateForm);
    });
}

// Handle course selection change
function handleCourseChange() {
    const selectedCourse = elements.course.value;
    elements.courseModule.innerHTML = '<option value="">Select course module</option>';
    elements.mainTopicDisplay.textContent = '';
    elements.subtopicsContainer.innerHTML = '';
    
    if (selectedCourse && curriculumData) {
        const course = curriculumData.topics.find(topic => topic.name === selectedCourse);
        if (course && course.main_topics) {
            course.main_topics.forEach(module => {
                const option = document.createElement('option');
                option.value = module.name;
                option.textContent = module.name;
                elements.courseModule.appendChild(option);
            });
        }
    }
    
    validateForm();
}

// Handle course module selection change
function handleCourseModuleChange() {
    const selectedCourse = elements.course.value;
    const selectedModule = elements.courseModule.value;
    
    elements.mainTopicDisplay.textContent = selectedModule || '';
    elements.subtopicsContainer.innerHTML = '';
    
    if (selectedCourse && selectedModule && curriculumData) {
        const course = curriculumData.topics.find(topic => topic.name === selectedCourse);
        if (course) {
            const module = course.main_topics.find(m => m.name === selectedModule);
            if (module && module.subtopics) {
                renderSubtopics(module.subtopics);
            }
        }
    }
    
    validateForm();
}

// Render subtopics as checkboxes
function renderSubtopics(subtopics) {
    elements.subtopicsContainer.innerHTML = '';
    
    subtopics.forEach((subtopic, index) => {
        const item = document.createElement('div');
        item.className = 'subtopic-item';
        item.setAttribute('data-subtopic', subtopic);
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `subtopic-${index}`;
        checkbox.name = 'subtopics';
        checkbox.value = subtopic;
        
        const label = document.createElement('label');
        label.htmlFor = `subtopic-${index}`;
        label.textContent = subtopic;
        
        item.appendChild(checkbox);
        item.appendChild(label);
        elements.subtopicsContainer.appendChild(item);
    });
    
    // Add event listeners to new checkboxes
    const checkboxes = elements.subtopicsContainer.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', validateForm);
    });
}

// Filter subtopics based on search
function filterSubtopics() {
    const searchTerm = elements.subtopicSearch.value.toLowerCase();
    const items = elements.subtopicsContainer.querySelectorAll('.subtopic-item');
    
    items.forEach(item => {
        const subtopic = item.getAttribute('data-subtopic').toLowerCase();
        if (subtopic.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Select all subtopics
function selectAllSubtopics() {
    const checkboxes = elements.subtopicsContainer.querySelectorAll('input[type="checkbox"]:not([style*="display: none"])');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
    validateForm();
}

// Clear all subtopics
function clearAllSubtopics() {
    const checkboxes = elements.subtopicsContainer.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    validateForm();
}

// Calculate attendance percentage
function calculateAttendance() {
    const present = parseInt(elements.presentStudents.value) || 0;
    const total = parseInt(elements.totalStudents.value) || 0;
    
    if (total > 0) {
        const percent = Math.round((present / total) * 100);
        elements.attendancePercent.textContent = `${percent}%`;
    } else {
        elements.attendancePercent.textContent = '';
    }
    
    validateForm();
}

// Validate form and enable/disable generate button
function validateForm() {
    const errors = [];
    
    // Required field validation
    const requiredFields = [
        { element: elements.trainingDate, name: 'Training Date' },
        { element: elements.instructorName, name: 'Instructor Name' },
        { element: elements.batchName, name: 'Batch Name' },
        { element: elements.presentStudents, name: 'Present Students' },
        { element: elements.totalStudents, name: 'Total Students' },
        { element: elements.trainingMode, name: 'Training Mode' },
        { element: elements.course, name: 'Course' },
        { element: elements.courseModule, name: 'Course Module' }
    ];
    
    requiredFields.forEach(field => {
        if (!field.element.value.trim()) {
            errors.push(`${field.name} is required`);
            field.element.classList.add('error');
        } else {
            field.element.classList.remove('error');
        }
    });
    
    // Attendance validation
    const present = parseInt(elements.presentStudents.value) || 0;
    const total = parseInt(elements.totalStudents.value) || 0;
    
    if (present > total) {
        errors.push('Present students cannot be greater than total students');
        elements.presentStudents.classList.add('error');
    } else {
        elements.presentStudents.classList.remove('error');
    }
    
    if (present < 0 || total < 0) {
        errors.push('Attendance numbers must be non-negative');
        if (present < 0) elements.presentStudents.classList.add('error');
        if (total < 0) elements.totalStudents.classList.add('error');
    }
    
    // Topics or notes validation
    const selectedSubtopics = elements.subtopicsContainer.querySelectorAll('input[type="checkbox"]:checked');
    const hasNotes = elements.additionalNotes.value.trim().length > 0;
    
    if (selectedSubtopics.length === 0 && !hasNotes) {
        errors.push('Please select at least one topic or add notes');
    }
    
    // Update generate button state
    elements.generateBtn.disabled = errors.length > 0;
    
    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(msg => msg.remove());
    
    // Show error messages
    if (errors.length > 0) {
        errors.forEach(error => {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = error;
            elements.form.appendChild(errorDiv);
        });
    }
    
    return errors.length === 0;
}

// Generate message from form data
function generateMessage() {
    if (!validateForm()) {
        return;
    }
    
    const formData = getFormData();
    const message = buildMessage(formData);
    
    // Display message preview
    elements.messagePreview.innerHTML = `<pre>${message}</pre>`;
    elements.previewActions.style.display = 'flex';
    
    // Store message for recent updates
    storeRecentMessage(formData, message);
    
    // Save preferences
    savePreferences(formData);
}

// Get form data
function getFormData() {
    const selectedSubtopics = Array.from(
        elements.subtopicsContainer.querySelectorAll('input[type="checkbox"]:checked')
    ).map(checkbox => checkbox.value);
    
    return {
        trainingDate: elements.trainingDate.value,
        instructorName: elements.instructorName.value.trim(),
        batchName: elements.batchName.value.trim(),
        presentStudents: parseInt(elements.presentStudents.value),
        totalStudents: parseInt(elements.totalStudents.value),
        trainingMode: elements.trainingMode.value,
        course: elements.course.value,
        courseModule: elements.courseModule.value,
        subtopics: selectedSubtopics,
        additionalNotes: elements.additionalNotes.value.trim()
    };
}

// Build formatted message
function buildMessage(data) {
    const attendancePercent = Math.round((data.presentStudents / data.totalStudents) * 100);
    const subtopicsList = data.subtopics.map(subtopic => `- ${subtopic}`).join('\n');
    
    let message = `📢 Batch Update
📅 Date: ${data.trainingDate}
👨‍🏫 Instructor: ${data.instructorName}
👥 Batch: ${data.batchName}
🧮 Attendance: ${data.presentStudents}/${data.totalStudents} (${attendancePercent}%)
🧑‍💻 Mode: ${data.trainingMode}
🎓 Course: ${data.course}
📚 Module: ${data.courseModule}

✅ Topics Covered:
${subtopicsList}`;

    if (data.additionalNotes) {
        message += `\n\n📝 Notes: ${data.additionalNotes}`;
    }
    
    return message;
}

// Copy message to clipboard
async function copyMessage() {
    const message = elements.messagePreview.querySelector('pre').textContent;
    
    try {
        await navigator.clipboard.writeText(message);
        showSuccess('Message copied to clipboard!');
    } catch (error) {
        console.error('Failed to copy message:', error);
        showError('Failed to copy message. Please try again.');
    }
}

// Share on WhatsApp
function shareOnWhatsApp() {
    const message = elements.messagePreview.querySelector('pre').textContent;
    const encodedMessage = encodeForWhatsApp(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

// Encode message for WhatsApp URL
function encodeForWhatsApp(str) {
    return encodeURIComponent(str);
}

// Reset form
function resetForm() {
    elements.form.reset();
    elements.trainingDate.value = new Date().toISOString().split('T')[0];
    elements.courseModule.innerHTML = '<option value="">Select course module</option>';
    elements.mainTopicDisplay.textContent = '';
    elements.subtopicsContainer.innerHTML = '';
    elements.attendancePercent.textContent = '';
    elements.messagePreview.innerHTML = '<p class="preview-placeholder">Generate a message to see preview</p>';
    elements.previewActions.style.display = 'none';
    
    // Clear error states
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.error-message').forEach(msg => msg.remove());
    
    // Reload saved preferences
    loadSavedPreferences();
    
    validateForm();
}

// Load saved preferences from localStorage
function loadSavedPreferences() {
    try {
        const saved = localStorage.getItem('trainerPreferences');
        if (saved) {
            const preferences = JSON.parse(saved);
            if (preferences.instructorName) elements.instructorName.value = preferences.instructorName;
            if (preferences.batchName) elements.batchName.value = preferences.batchName;
            if (preferences.trainingMode) elements.trainingMode.value = preferences.trainingMode;
        }
    } catch (error) {
        console.error('Error loading preferences:', error);
    }
}

// Save preferences to localStorage
function savePreferences(data) {
    try {
        const preferences = {
            instructorName: data.instructorName,
            batchName: data.batchName,
            trainingMode: data.trainingMode
        };
        localStorage.setItem('trainerPreferences', JSON.stringify(preferences));
    } catch (error) {
        console.error('Error saving preferences:', error);
    }
}

// Store recent message
function storeRecentMessage(data, message) {
    const recentMessage = {
        id: Date.now(),
        date: data.trainingDate,
        batch: data.batchName,
        course: data.course,
        module: data.courseModule,
        subtopicCount: data.subtopics.length,
        message: message,
        timestamp: new Date().toISOString()
    };
    
    recentMessages.unshift(recentMessage);
    
    // Keep only last 10 messages
    if (recentMessages.length > 10) {
        recentMessages = recentMessages.slice(0, 10);
    }
    
    // Save to localStorage
    try {
        localStorage.setItem('recentMessages', JSON.stringify(recentMessages));
    } catch (error) {
        console.error('Error saving recent messages:', error);
    }
    
    // Update UI
    updateRecentMessagesUI();
}

// Load recent messages from localStorage
function loadRecentMessages() {
    try {
        const saved = localStorage.getItem('recentMessages');
        if (saved) {
            recentMessages = JSON.parse(saved);
            updateRecentMessagesUI();
        }
    } catch (error) {
        console.error('Error loading recent messages:', error);
    }
}

// Update recent messages UI
function updateRecentMessagesUI() {
    if (recentMessages.length === 0) {
        elements.recentUpdates.innerHTML = '<p class="no-recent">No recent updates</p>';
        return;
    }
    
    elements.recentUpdates.innerHTML = recentMessages.map(msg => `
        <div class="recent-item">
            <div class="recent-info">
                <div class="recent-date">${msg.date} - ${msg.batch}</div>
                <div class="recent-details">${msg.course} | ${msg.module} | ${msg.subtopicCount} topics</div>
            </div>
            <div class="recent-actions">
                <button class="btn-primary btn-small" onclick="copyRecentMessage(${msg.id})">Copy</button>
            </div>
        </div>
    `).join('');
}

// Copy recent message
function copyRecentMessage(messageId) {
    const message = recentMessages.find(msg => msg.id === messageId);
    if (message) {
        navigator.clipboard.writeText(message.message).then(() => {
            showSuccess('Message copied to clipboard!');
        }).catch(error => {
            console.error('Failed to copy message:', error);
            showError('Failed to copy message. Please try again.');
        });
    }
}

// Show success message
function showSuccess(message) {
    // Create temporary success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #38a169;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Show error message
function showError(message) {
    // Create temporary error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #e53e3e;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
