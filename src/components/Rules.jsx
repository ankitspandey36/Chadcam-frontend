import React from 'react';
import { ShieldCheck, EyeOff, Ban, UserCheck } from 'lucide-react';

const rules = [
    {
        icon: <ShieldCheck className="w-4 h-4 text-green-400 flex-shrink-0" />,
        text: "All sessions are end-to-end encrypted for your privacy.",
    },
    {
        icon: <EyeOff className="w-4 h-4 text-yellow-400 flex-shrink-0" />,
        text: "No recordings are made without your explicit permission.",
    },
    {
        icon: <Ban className="w-4 h-4 text-red-400 flex-shrink-0" />,
        text: "Hate speech, bullying, or harassment leads to instant ban.",
    },
    {
        icon: <UserCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />,
        text: "Verified users only can access camera sessions.",
    }
];

const RulesSection = () => {
  return (
    <div className="mt-4 px-4 overflow-y-auto scrollbar-hide  max-h-[calc(100vh-100px)]">
      <h2 className="text-white text-lg font-semibold mb-2">
        Privacy & Safety Rules
      </h2>
      <ul className="space-y-3 break-words">
        {rules.map((rule, index) => (
          <li
            key={index}
            className="flex items-start space-x-3 text-sm text-gray-300 break-words"
          >
            <span className="mt-1 shrink-0">{rule.icon}</span>
            <span className="whitespace-normal break-words">{rule.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default RulesSection;
