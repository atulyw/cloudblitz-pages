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
    subject: document.getElementById('subject'),
    courseModule: document.getElementById('courseModule'),
    mainTopicDisplay: document.getElementById('mainTopicDisplay'),
    subtopicSearch: document.getElementById('subtopicSearch'),
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
        
        // Curriculum data will be loaded when course is selected
        
        // Load saved preferences
        loadSavedPreferences();
        
        // Load recent messages
        loadRecentMessages();
        
        // Set up event listeners
        setupEventListeners();
        
        // Mobile-specific optimizations
        setupMobileOptimizations();
        
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
        
        // Subject dropdown will be populated after YAML data is loaded
        
        console.log('Curriculum data loaded successfully');
    } catch (error) {
        console.error('Error loading curriculum data:', error);
        throw error;
    }
}

// Populate subject dropdown based on course selection
function populateSubjectDropdown() {
    elements.subject.innerHTML = '<option value="">Select subject</option>';
    
    const selectedCourse = elements.course.value;
    
    // Only load subjects for "Cloud DevOps Engineering Course with AI"
    if (selectedCourse === 'Cloud DevOps Engineering Course with AI' && curriculumData && curriculumData.topics) {
        curriculumData.topics.forEach(topic => {
            const option = document.createElement('option');
            option.value = topic.name;
            option.textContent = topic.name;
            elements.subject.appendChild(option);
        });
    } else if (selectedCourse && selectedCourse !== 'Cloud DevOps Engineering Course with AI') {
        // For other courses, show placeholder message
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Subject data will be available soon';
        option.disabled = true;
        elements.subject.appendChild(option);
    }
}

// Set up all event listeners
function setupEventListeners() {
    // Course change handler
    elements.course.addEventListener('change', handleCourseChange);
    
    // Subject change handler
    elements.subject.addEventListener('change', handleSubjectChange);
    
    // Course module change handler
    elements.courseModule.addEventListener('change', handleCourseModuleChange);
    
    // Attendance calculation
    elements.presentStudents.addEventListener('input', calculateAttendance);
    elements.totalStudents.addEventListener('input', calculateAttendance);
    
    // Subtopic search
    elements.subtopicSearch.addEventListener('input', filterSubtopics);
    
    // Clear all button
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
async function handleCourseChange() {
    const selectedCourse = elements.course.value;
    
    // Clear subject and course module dropdowns
    elements.subject.innerHTML = '<option value="">Select subject</option>';
    elements.courseModule.innerHTML = '<option value="">Select course module</option>';
    elements.mainTopicDisplay.textContent = '';
    elements.subtopicsContainer.innerHTML = '';
    
    // Load YAML data only for "Cloud DevOps Engineering Course with AI"
    if (selectedCourse === 'Cloud DevOps Engineering Course with AI') {
        await loadCurriculumData();
        populateSubjectDropdown();
    } else {
        // Clear curriculum data for other courses
        curriculumData = null;
        populateSubjectDropdown();
    }
    
    validateForm();
}

// Handle subject selection change
function handleSubjectChange() {
    const selectedSubject = elements.subject.value;
    elements.courseModule.innerHTML = '<option value="">Select course module</option>';
    elements.mainTopicDisplay.textContent = '';
    elements.subtopicsContainer.innerHTML = '';
    
    if (selectedSubject && curriculumData) {
        const subject = curriculumData.topics.find(topic => topic.name === selectedSubject);
        if (subject && subject.main_topics) {
            subject.main_topics.forEach(module => {
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
    const selectedSubject = elements.subject.value;
    const selectedModule = elements.courseModule.value;
    
    elements.mainTopicDisplay.textContent = selectedModule || '';
    elements.subtopicsContainer.innerHTML = '';
    
    if (selectedSubject && selectedModule && curriculumData) {
        const subject = curriculumData.topics.find(topic => topic.name === selectedSubject);
        if (subject) {
            const module = subject.main_topics.find(m => m.name === selectedModule);
            if (module && module.subtopics) {
                renderSubtopics(module.subtopics);
            }
        }
    }
    
    validateForm();
}

// Toggle checkbox and update visual state
function toggleCheckbox(checkbox, item) {
    checkbox.checked = !checkbox.checked;
    
    // Update visual state
    if (checkbox.checked) {
        item.classList.add('checked');
    } else {
        item.classList.remove('checked');
    }
    
    // Trigger change event
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
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
        
        // Make the entire row clickable
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCheckbox(checkbox, item);
        });
        
        // Also make label clickable
        label.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCheckbox(checkbox, item);
        });
        
        // Add touch events for mobile
        item.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCheckbox(checkbox, item);
        });
        
        // Add event listeners to checkboxes
        checkbox.addEventListener('change', (e) => {
            validateForm();
            // Add visual feedback for checked state
            if (e.target.checked) {
                item.classList.add('checked');
            } else {
                item.classList.remove('checked');
            }
        });
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
    const isMobile = window.innerWidth <= 768;
    
    // Required field validation
    const requiredFields = [
        { element: elements.trainingDate, name: 'Training Date' },
        { element: elements.instructorName, name: 'Instructor Name' },
        { element: elements.batchName, name: 'Batch Name' },
        { element: elements.presentStudents, name: 'Present Students' },
        { element: elements.totalStudents, name: 'Total Students' },
        { element: elements.trainingMode, name: 'Training Mode' },
        { element: elements.course, name: 'Course' },
        { element: elements.subject, name: 'Subject' },
        { element: elements.courseModule, name: 'Course Module' }
    ];
    
    requiredFields.forEach(field => {
        if (!field.element.value.trim()) {
            errors.push(`${field.name} is required`);
            field.element.classList.add('error');
            
            // Add mobile-specific error handling
            if (isMobile) {
                field.element.style.borderColor = '#e53e3e';
                field.element.style.boxShadow = '0 0 0 2px rgba(229, 62, 62, 0.2)';
            }
        } else {
            field.element.classList.remove('error');
            
            // Remove mobile-specific error styling
            if (isMobile) {
                field.element.style.borderColor = '';
                field.element.style.boxShadow = '';
            }
        }
    });
    
    // Attendance validation
    const present = parseInt(elements.presentStudents.value) || 0;
    const total = parseInt(elements.totalStudents.value) || 0;
    
    if (present > total) {
        errors.push('Present students cannot be greater than total students');
        elements.presentStudents.classList.add('error');
        if (isMobile) {
            elements.presentStudents.style.borderColor = '#e53e3e';
            elements.presentStudents.style.boxShadow = '0 0 0 2px rgba(229, 62, 62, 0.2)';
        }
    } else {
        elements.presentStudents.classList.remove('error');
        if (isMobile) {
            elements.presentStudents.style.borderColor = '';
            elements.presentStudents.style.boxShadow = '';
        }
    }
    
    if (present < 0 || total < 0) {
        errors.push('Attendance numbers must be non-negative');
        if (present < 0) {
            elements.presentStudents.classList.add('error');
            if (isMobile) {
                elements.presentStudents.style.borderColor = '#e53e3e';
                elements.presentStudents.style.boxShadow = '0 0 0 2px rgba(229, 62, 62, 0.2)';
            }
        }
        if (total < 0) {
            elements.totalStudents.classList.add('error');
            if (isMobile) {
                elements.totalStudents.style.borderColor = '#e53e3e';
                elements.totalStudents.style.boxShadow = '0 0 0 2px rgba(229, 62, 62, 0.2)';
            }
        }
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
    
    // Show error messages with mobile-friendly styling
    if (errors.length > 0) {
        errors.forEach(error => {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = error;
            
            // Add mobile-specific styling
            if (isMobile) {
                errorDiv.style.cssText = `
                    background: #fed7d7;
                    color: #c53030;
                    padding: 0.75rem;
                    border-radius: 6px;
                    margin: 0.5rem 0;
                    font-size: 0.9rem;
                    border-left: 4px solid #e53e3e;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                `;
            }
            
            elements.form.appendChild(errorDiv);
        });
        
        // Scroll to first error on mobile
        if (isMobile && errors.length > 0) {
            const firstError = document.querySelector('.error-message');
            if (firstError) {
                setTimeout(() => {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        }
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
        subject: elements.subject.value,
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
📚 Subject: ${data.subject}
📖 Module: ${data.courseModule}

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
        subject: data.subject,
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
                <div class="recent-details">${msg.course} | ${msg.subject} | ${msg.module} | ${msg.subtopicCount} topics</div>
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

// Mobile-specific optimizations
function setupMobileOptimizations() {
    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    if (!isMobile) return;
    
    // Prevent zoom on input focus for iOS
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type !== 'range' && input.type !== 'checkbox' && input.type !== 'radio') {
            input.addEventListener('focus', () => {
                input.style.fontSize = '16px';
                // Scroll input into view on mobile
                setTimeout(() => {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
            
            input.addEventListener('blur', () => {
                // Reset font size after blur to maintain responsive design
                setTimeout(() => {
                    input.style.fontSize = '';
                }, 100);
            });
        }
    });
    
    // Improve touch scrolling
    document.body.style.webkitOverflowScrolling = 'touch';
    
    // Add touch feedback for buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            button.style.transform = 'scale(0.95)';
            button.style.transition = 'transform 0.1s ease';
        });
        
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            setTimeout(() => {
                button.style.transform = '';
            }, 100);
        });
        
        button.addEventListener('touchcancel', () => {
            button.style.transform = '';
        });
    });
    
    // Optimize form interactions for mobile
    const form = document.getElementById('batchForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Prevent form submission on mobile to avoid page refresh
        });
    }
    
    // Improve dropdown experience on mobile
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', () => {
            // Trigger validation after selection
            setTimeout(validateForm, 100);
        });
        
        select.addEventListener('focus', () => {
            // Scroll select into view on mobile
            setTimeout(() => {
                select.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });
    
    // Add haptic feedback for supported devices
    if ('vibrate' in navigator) {
        const actionButtons = document.querySelectorAll('.btn-primary, .btn-whatsapp');
        actionButtons.forEach(button => {
            button.addEventListener('click', () => {
                navigator.vibrate(50); // Short vibration
            });
        });
    }
    
    // Improve checkbox interactions on mobile
    const subtopicItems = document.querySelectorAll('.subtopic-item');
    subtopicItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox) {
            // Add touch feedback
            item.addEventListener('touchstart', (e) => {
                e.preventDefault();
                item.style.backgroundColor = '#e2e8f0';
                item.style.transition = 'background-color 0.1s ease';
            });
            
            item.addEventListener('touchend', (e) => {
                e.preventDefault();
                setTimeout(() => {
                    item.style.backgroundColor = '';
                }, 150);
            });
            
            item.addEventListener('touchcancel', () => {
                item.style.backgroundColor = '';
            });
            
            // Ensure checkbox is properly focused
            checkbox.addEventListener('focus', () => {
                item.style.backgroundColor = '#f0f4f8';
            });
            
            checkbox.addEventListener('blur', () => {
                item.style.backgroundColor = '';
            });
        }
    });
    
    // Improve textarea handling on mobile
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('focus', () => {
            // Scroll textarea into view on mobile
            setTimeout(() => {
                textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });
    
    // Add mobile-specific keyboard handling
    document.addEventListener('keydown', (e) => {
        // Handle Enter key on mobile keyboards
        if (e.key === 'Enter' && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT')) {
            const form = e.target.closest('form');
            if (form) {
                const inputs = Array.from(form.querySelectorAll('input, select, textarea'));
                const currentIndex = inputs.indexOf(e.target);
                const nextInput = inputs[currentIndex + 1];
                
                if (nextInput) {
                    e.preventDefault();
                    nextInput.focus();
                } else {
                    // If it's the last input, focus the generate button
                    const generateBtn = document.getElementById('generateBtn');
                    if (generateBtn && !generateBtn.disabled) {
                        e.preventDefault();
                        generateBtn.focus();
                    }
                }
            }
        }
    });
    
    // Improve mobile scrolling performance
    let ticking = false;
    function updateScrollPosition() {
        // Add any scroll-based optimizations here
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollPosition);
            ticking = true;
        }
    });
    
    // Add mobile-specific error handling
    window.addEventListener('error', (e) => {
        console.error('Mobile error:', e.error);
        // Could add mobile-specific error reporting here
    });
    
    // Optimize for mobile performance
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            // Perform non-critical mobile optimizations
            optimizeForMobile();
        });
    } else {
        setTimeout(optimizeForMobile, 1000);
    }
}

// Additional mobile optimization function
function optimizeForMobile() {
    // Lazy load images if any
    const images = document.querySelectorAll('img[data-src]');
    if (images.length > 0 && 'IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Preload critical resources
    const criticalResources = [
        '/data/cdec-ai-topics.yaml'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = resource;
        document.head.appendChild(link);
    });
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
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Mobile-specific animations */
    @media (max-width: 768px) {
        .btn-primary:active,
        .btn-secondary:active,
        .btn-whatsapp:active {
            transform: scale(0.95) !important;
            transition: transform 0.1s ease;
        }
        
        .subtopic-item:active {
            background-color: #e2e8f0;
            transition: background-color 0.1s ease;
        }
        
        /* Smooth transitions for mobile */
        .card {
            animation: fadeIn 0.3s ease-out;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            transform: scale(1.02);
            transition: all 0.2s ease;
        }
        
        /* Mobile loading states */
        .loading {
            opacity: 0.7;
            pointer-events: none;
        }
        
        .loading::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            margin: -10px 0 0 -10px;
            border: 2px solid #667eea;
            border-top: 2px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
    }
    
    /* Improved mobile scrollbars */
    @media (max-width: 768px) {
        ::-webkit-scrollbar {
            width: 4px;
        }
        
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 2px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
    }
`;
document.head.appendChild(style);
