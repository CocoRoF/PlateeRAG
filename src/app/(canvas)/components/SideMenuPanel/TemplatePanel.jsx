"use client";
import React, { useState, useEffect } from 'react';
import styles from '@/app/(canvas)/assets/WorkflowPanel.module.scss';
import sideMenuStyles from '@/app/(canvas)/assets/SideMenu.module.scss';
import { LuArrowLeft, LuLayoutTemplate, LuPlay, LuCopy } from "react-icons/lu";
import TemplatePreview from '@/app/(canvas)/components/SideMenuPanel/TemplatePreview';
import { devLog } from '@/app/utils/logger';

import Basic_Chatbot from '@/app/(canvas)/constants/workflow/Basic_Chatbot.json';
import Data_Processing from '@/app/(canvas)/constants/workflow/Data_Processing.json';

const templateList = [Basic_Chatbot, Data_Processing];

const TemplatePanel = ({ onBack, onLoadWorkflow }) => {
    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [previewTemplate, setPreviewTemplate] = useState(null);

    useEffect(() => {
        const loadTemplates = async () => {
            try {
                setIsLoading(true);

                devLog.log('templateList:', templateList);
                
                const formattedTemplates = templateList.map(template => ({
                    id: template.id,
                    name: template.name,
                    description: template.description || 'No description available',
                    tags: template.tags || [],
                    nodes: template.contents?.nodes?.length || 0,
                    data: template.contents
                }));

                setTemplates(formattedTemplates);
                setIsLoading(false);
            } catch (error) {
                devLog.error('Failed to load templates:', error);
                setTemplates([]);
                setIsLoading(false);
            }
        };

        loadTemplates();
    }, []);

    const handleUseTemplate = (template) => {
        devLog.log('=== TemplatePanel handleUseTemplate called ===');
        devLog.log('Template:', template);
        devLog.log('onLoadWorkflow exists:', !!onLoadWorkflow);
        devLog.log('Template data exists:', !!template?.data);
        
        if (onLoadWorkflow && template.data) {
            devLog.log('Calling onLoadWorkflow with:', template.data, template.name);
            onLoadWorkflow(template.data, template.name);
            devLog.log('onLoadWorkflow call completed');
        } else {
            devLog.error('Cannot call onLoadWorkflow:', {
                hasOnLoadWorkflow: !!onLoadWorkflow,
                hasTemplateData: !!template?.data
            });
        }
    };

    const handlePreviewTemplate = (template) => {
        devLog.log('Previewing template:', template);
        devLog.log('Setting previewTemplate state to:', template);
        setPreviewTemplate(template); // 미리보기 템플릿 설정
    };

    const handleClosePreview = () => {
        devLog.log('Closing preview');
        setPreviewTemplate(null); // 미리보기 닫기
    };

    if (isLoading) {
        return (
            <div className={styles.workflowPanel}>
                <div className={sideMenuStyles.header}>
                    <button onClick={onBack} className={sideMenuStyles.backButton}>
                        <LuArrowLeft />
                    </button>
                    <h3>Templates</h3>
                </div>
                <div className={styles.loadingState}>
                    <LuLayoutTemplate className={styles.spinIcon} />
                    <span>Loading templates...</span>
                </div>
            </div>
        );
    }

    devLog.log('TemplatePanel render - previewTemplate:', previewTemplate);

    return (
        <div className={styles.workflowPanel}>
            <div className={sideMenuStyles.header}>
                <button onClick={onBack} className={sideMenuStyles.backButton}>
                    <LuArrowLeft />
                </button>
                <h3>Templates</h3>
            </div>

            <div className={styles.workflowList}>
                <div className={styles.listHeader}>
                    <h3>📁 Available Templates</h3>
                    <span className={styles.count}>{templates.length}</span>
                </div>

                <div className={styles.templateList}>
                    {templates.map(template => (
                        <div key={template.id} className={styles.templateItem}>
                            <div className={styles.templateHeader}>
                                <div className={styles.templateIcon}>
                                    <LuLayoutTemplate />
                                </div>
                                <div className={styles.templateInfo}>
                                    <h4 className={styles.templateName}>{template.name}</h4>
                                    <p className={styles.templateDescription}>
                                        {template.description && template.description.length > 20 
                                            ? `${template.description.substring(0, 20)}...` 
                                            : template.description
                                        }
                                    </p>
                                    <div className={styles.templateMeta}>
                                        <div className={styles.templateTags}>
                                            {template.tags && template.tags.slice(0, 2).map(tag => (
                                                <span key={tag} className={styles.templateCategory}>
                                                    {tag}
                                                </span>
                                            ))}
                                            {template.tags && template.tags.length > 2 && (
                                                <span className={styles.templateCategory}>
                                                    +{template.tags.length - 2}
                                                </span>
                                            )}
                                        </div>
                                        <span className={styles.templateNodes}>{template.nodes} nodes</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.templateActions}>
                                <button 
                                    className={styles.templateActionButton}
                                    onClick={() => handlePreviewTemplate(template)}
                                    title="Preview Template"
                                >
                                    <LuCopy />
                                </button>
                                <button 
                                    className={styles.templateActionButton}
                                    onClick={() => handleUseTemplate(template)}
                                    title="Use Template"
                                >
                                    <LuPlay />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 템플릿 미리보기 팝업 */}
            {previewTemplate && (
                <TemplatePreview
                    template={previewTemplate}
                    onClose={handleClosePreview}
                    onUseTemplate={handleUseTemplate}
                />
            )}
        </div>
    );
};

export default TemplatePanel;
