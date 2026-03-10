/**
 * Reverse String Application - JavaScript Module
 * Security: Implements XSS prevention, input validation, and secure string reversal
 * Real-time processing with no button interactions required
 */

'use strict';

(function() {
    // DOM Element References
    const inputText = document.getElementById('inputText');
    const reversedTextDisplay = document.getElementById('reversedText');
    const charCount = document.getElementById('charCount');

    const MAX_LENGTH = 1000;

    /**
     * Safely reverses a string
     * @param {string} str - The string to reverse
     * @returns {string} - The reversed string
     */
    function reverseString(str) {
        // Validate input type
        if (typeof str !== 'string') {
            throw new TypeError('Input must be a string');
        }

        // Use array spread and reverse method for safe reversal
        // This handles Unicode characters correctly
        return [...str].reverse().join('');
    }

    /**
     * Sanitizes input to prevent code injection
     * @param {string} input - The input to sanitize
     * @returns {string} - The sanitized input
     */
    function sanitizeInput(input) {
        // Ensure input is a string
        if (typeof input !== 'string') {
            return '';
        }

        // Enforce maximum length
        if (input.length > MAX_LENGTH) {
            return input.substring(0, MAX_LENGTH);
        }

        return input;
    }

    /**
     * Displays the reversed text safely using textContent (prevents XSS)
     * @param {string} text - The text to display
     */
    function displayReversedText(text) {
        // Validate input
        if (!text || typeof text !== 'string' || text.length === 0) {
            reversedTextDisplay.textContent = 'Start typing to see your text reversed...';
            reversedTextDisplay.classList.add('empty-state');
            return;
        }

        // Remove empty-state class if present
        reversedTextDisplay.classList.remove('empty-state');

        // Use textContent to prevent XSS attacks (not innerHTML)
        // This ensures any content is treated as plain text
        reversedTextDisplay.textContent = text;
    }

    /**
     * Updates character count
     * @param {number} count - The character count
     */
    function updateCharCount(count) {
        if (charCount) {
            charCount.textContent = count.toString();
        }
    }

    /**
     * Handles input field changes for real-time reversal
     */
    function handleInput() {
        try {
            // Get and sanitize input
            const input = sanitizeInput(inputText.value);

            // Update character count
            updateCharCount(input.length);

            // Reverse the string in real-time
            if (input.length > 0) {
                const reversed = reverseString(input);
                displayReversedText(reversed);
            } else {
                displayReversedText('');
            }
        } catch (error) {
            console.error('Error reversing string:', error);
            reversedTextDisplay.textContent = 'An error occurred. Please try again.';
            reversedTextDisplay.classList.add('empty-state');
        }
    }

    /**
     * Initializes event listeners for real-time processing
     */
    function initializeEventListeners() {
        // Input event for real-time character-by-character reversal
        inputText.addEventListener('input', handleInput);

        // Paste event to handle pasted content
        inputText.addEventListener('paste', function() {
            // Schedule the reversal after paste completes
            setTimeout(handleInput, 0);
        });
    }

    /**
     * Application initialization
     */
    function initialize() {
        try {
            // Verify that all required DOM elements exist
            if (!inputText || !reversedTextDisplay) {
                throw new Error('Required DOM elements not found');
            }

            // Initialize event listeners
            initializeEventListeners();

            // Set focus to input field for better UX
            inputText.focus();

            // Initialize character count
            updateCharCount(0);

            console.log('Reverse String Application initialized successfully');
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    // Initialize the application when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM is already loaded
        initialize();
    }
})();
