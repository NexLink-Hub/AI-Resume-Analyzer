import {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'

export function formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i: number = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
interface FileUploaderProps {
    file: File | null;
    onFileSelect: (file: File | null) => void;
}
const FileUploader = ({ file, onFileSelect }: FileUploaderProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const dropFile = acceptedFiles[0] || null;
        onFileSelect?.(dropFile);
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024; // 20 MB in bytes

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        multiple: false,
        accept: {'application/pdf': ['.pdf']},
        maxSize: maxFileSize,
    });

    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="space-y-4 cursor-pointer">

                </div>

                {file ? (
                    <div className="uploader-selected-file" onClick={(e)=>e.stopPropagation()}>
                        <img src="/images/pdf.png" alt="pdf" className="size-10"/>
                        <div className="flex items-center space-x-3">
                            <div>
                                <p className="text-sm text-gray-700 font-medium truncate max-w-xs">
                                    {file.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {formatSize(file.size)}
                                </p>
                            </div>
                        </div>
                        <button type="button" className="p-2 cursor-pointer" onClick={(e)=>{
                            e.preventDefault();
                            onFileSelect?.(null);
                        }}>
                            <img src="/icons/cross.svg" alt="remove" className="w-4 h-4"/>
                        </button>
                    </div>

                ) : (
                    <div>
                        <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                            <img src="/icons/info.svg" alt="upload" className="size-20"/>
                        </div>
                        <p className="text-lg text-gray-500">
                         <span className="font-semibold">
                           Click to upload
                         </span> or drag n drop
                        </p>
                        <p className="text-lg text-gray-500">PDF (max {formatSize(maxFileSize)})</p>
                    </div>
                )}
            </div>
        </div>
    )
}
export default FileUploader;
