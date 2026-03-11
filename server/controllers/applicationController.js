import Application from '../models/Application.js';

// @desc    Create new application
// @route   POST /api/applications
export const createApplication = async (req, res) => {
    try {
        const application = new Application({
            ...req.body,
            user: req.user._id // Attach the logged-in user's ID
        });
        const createdApplication = await application.save();
        res.status(201).json(createdApplication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user applications
// @route   GET /api/applications
export const getApplications = async (req, res) => {
    try {
        const applications = await Application.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update an application
// @route   PUT /api/applications/:id
export const updateApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Make sure the logged in user matches the application user
        if (application.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this application' });
        }

        const updatedApplication = await Application.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Return the updated document
        );

        res.json(updatedApplication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an application
// @route   DELETE /api/applications/:id
export const deleteApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Make sure the logged in user matches the application user
        if (application.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this application' });
        }

        await application.deleteOne();
        res.json({ message: 'Application removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};