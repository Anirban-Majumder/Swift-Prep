"use client"
import React, { useState, useContext } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SessionContext } from '@/lib/supabase/usercontext';
import { useRouter } from 'next/navigation';
import { Profile } from '@/lib/db_types';

const SetUpPage = () => {
    const { sessionData, setSessionData } = useContext(SessionContext);
    const supabase = createClient();
    const router = useRouter();
    
    const [formData, setFormData] = useState({
        name: '',
        grade: '',
        techProficiency: 'intermediate',
        learningStyle: '',
        challenges: [] as string[]
    });

    // Handler for standard inputs and selects
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'radio') {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Specialized handler for challenges checkboxes
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            if (checked) {
                return {
                    ...prev,
                    challenges: [...prev.challenges, value]
                };
            } else {
                return {
                    ...prev,
                    challenges: prev.challenges.filter(item => item !== value)
                };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const user_id = sessionData.session?.user.id;
        const nameParts = formData.name.split(" ");
        
        if (user_id) {
            const { error } = await supabase.from('profiles_swiftprep').upsert({
                user_id: user_id,
                first_name: nameParts[0] || "",
                last_name: nameParts.slice(1).join(" ") || "",
                grade: formData.grade,
                tech_proficiency: formData.techProficiency,
                learning_style: formData.learningStyle,
                learning_challenges: formData.challenges,
            }, {
                onConflict: 'user_id'
            });

            if (error) {
                console.error('Error submitting user data:', error);
                alert(error.message);
            } else {
                console.log('User data submitted successfully!');
                // Update the Session context
                if (sessionData.profile) {
                    setSessionData(prev => ({
                        ...prev,
                        profile: {
                            ...prev.profile,
                            first_name: nameParts[0] || "",
                            last_name: nameParts.slice(1).join(" ") || "",
                            grade: formData.grade,
                            tech_proficiency: formData.techProficiency,
                            learning_style: formData.learningStyle,
                            learning_challenges: formData.challenges,
                        } as Profile,
                    }));
                }
                router.push('/Dashboard');
            }
        } else {
            console.error('No valid session found.');
            alert('No valid session found. Please sign in again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-2xl dark:bg-zinc-800">
                <div className="text-center">
                    <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">
                        Set Up Your Learning Profile
                    </h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 mt-1 border rounded-2xl dark:bg-zinc-700 dark:text-white focus:ring focus:ring-teal-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="grade" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                            Grade/Education Level <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="grade"
                            name="grade"
                            value={formData.grade}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-1 border rounded-2xl dark:bg-zinc-700 dark:text-white focus:ring focus:ring-teal-500"
                            required
                        >
                            <option value="">Select Grade</option>
                            <option value="elementary">Elementary</option>
                            <option value="middle">Middle School</option>
                            <option value="high">High School</option>
                            <option value="undergraduate">Undergraduate</option>
                            <option value="postgraduate">Postgraduate</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                            Technological Proficiency
                        </label>
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="techProficiency"
                                    value="beginner"
                                    checked={formData.techProficiency === 'beginner'}
                                    onChange={handleChange}
                                    className="text-blue-500"
                                />
                                <span className="text-sm dark:text-zinc-300">Beginner</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="techProficiency"
                                    value="intermediate"
                                    checked={formData.techProficiency === 'intermediate'}
                                    onChange={handleChange}
                                    className="text-blue-500"
                                />
                                <span className="text-sm dark:text-zinc-300">Intermediate</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="techProficiency"
                                    value="advanced"
                                    checked={formData.techProficiency === 'advanced'}
                                    onChange={handleChange}
                                    className="text-blue-500"
                                />
                                <span className="text-sm dark:text-zinc-300">Advanced</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="learningStyle" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                            Learning Style <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="learningStyle"
                            name="learningStyle"
                            value={formData.learningStyle}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-1 border rounded-2xl dark:bg-zinc-700 dark:text-white focus:ring focus:ring-teal-500"
                            required
                        >
                            <option value="">Select Learning Style</option>
                            <option value="visual">Visual Learner</option>
                            <option value="auditory">Auditory Learner</option>
                            <option value="reading">Reading/Writing Learner</option>
                            <option value="quickLearner">Quick Learner</option>
                            <option value="slowLearner">Slow Learner</option>
                            <option value="multimodal">Multimodal Learner</option>

                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                            Learning Challenges (if any)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="challenges"
                                    value="dyslexia"
                                    checked={formData.challenges.includes('dyslexia')}
                                    onChange={handleCheckboxChange}
                                    className="text-blue-500"
                                />
                                <span className="text-sm dark:text-zinc-300">Dyslexia</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="challenges"
                                    value="adhd"
                                    checked={formData.challenges.includes('adhd')}
                                    onChange={handleCheckboxChange}
                                    className="text-blue-500"
                                />
                                <span className="text-sm dark:text-zinc-300">ADHD</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="challenges"
                                    value="autism"
                                    checked={formData.challenges.includes('autism')}
                                    onChange={handleCheckboxChange}
                                    className="text-blue-500"
                                />
                                <span className="text-sm dark:text-zinc-300">Autism</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="challenges"
                                    value="other"
                                    checked={formData.challenges.includes('other')}
                                    onChange={handleCheckboxChange}
                                    className="text-blue-500"
                                />
                                <span className="text-sm dark:text-zinc-300">Other</span>
                            </label>
                        </div>
                    </div>
                    
                    <button type="submit" className="w-full px-4 py-2 text-white bg-pink-500 dark:bg-pink-600 rounded-full hover:bg-pink-600 dark:hover:bg-pink-700">
                        Complete Setup
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SetUpPage;