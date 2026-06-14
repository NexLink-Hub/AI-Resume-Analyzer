import React from 'react';
interface ScoreBadgeProps {
    score: number;
}

const ScoreBadge : React.FC<ScoreBadgeProps>= ({ score }) => {
    // Determine badge style and text based on score
    let badgeClass = '';
    let badgeText = '';

    if (score > 70) {
        badgeClass = 'bg-badge-green text-green-600';
        badgeText = 'Strong';
    } else if (score > 49) {
        badgeClass = 'bg-badge-yellow text-yellow-600';
        badgeText = 'Good Start';
    } else {
        badgeClass = 'bg-badge-red text-red-600';
        badgeText = 'Needs Work';
    }

    return (
        <div className={`inline-flex items-center px-3 py-1 rounded-full ${badgeClass}`}>
            <p className="text-sm font-medium">{badgeText}</p>
        </div>
    );
};

export default ScoreBadge;