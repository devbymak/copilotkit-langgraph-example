import { type InputProps } from '@copilotkit/react-ui';
import {
    useState,
    useEffect,
    useRef,
    type KeyboardEvent,
} from 'react';

export const CopilotInput = ({ onSend, inProgress }: InputProps) => {
    const [text, setText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            textarea.style.height = `${scrollHeight}px`;
        }
    }, [text]);

    const handleSend = async () => {
        if (!text.trim()) return;

        onSend(text);
        setText('');
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleContainerClick = () => {
        textareaRef.current?.focus();
    };

    return (
        <div className="copilotKitInputContainer">
            <div className="copilotKitInput" onClick={handleContainerClick}>
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Create survey questions..."
                    style={{
                        overflow: 'auto',
                        resize: 'none',
                    }}
                    rows={1}
                    disabled={inProgress}
                />
                <div className="copilotKitInputControls">
                    <div style={{ flexGrow: 1 }}></div>
                    <button
                        onClick={handleSend}
                        disabled={inProgress || !text.trim()}
                        data-copilotkit-in-progress={inProgress}
                        className="copilotKitInputControlButton"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            width="24"
                            height="24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 19V5m0 0l-7 7m7-7l7 7"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
