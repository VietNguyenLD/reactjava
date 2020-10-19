// Import React as usual
import React from 'react';

// Import Noty for nice file open notifications
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/relax.css';
import { ExclamationCircleOutlined, InboxOutlined } from '@ant-design/icons';
import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    FormGroup,
    Label,
    FormText,
    Row,
    Col,
    Media,
    Spinner,
    CardFooter,
    TabContent, TabPane, Nav, NavItem, NavLink
} from "reactstrap";
// Import Chonky
import 'chonky/style/main.css';
import { FileBrowser, FileView, demoFileMap, demoRootFolderId } from 'chonky';
import { Modal, Button, Input, Upload, message } from 'antd';
const { confirm } = Modal;
const { Dragger } = Upload;
export default class UploadFileIndex extends React.Component {

    constructor(props) {
        super(props);

        this.fileMap = demoFileMap;
        this.state = { currentFolderId: demoRootFolderId, visible: false, visible1: false, name: '' };
    }

    handleFileOpen = (file) => {
        if (file.isDir) {
            this.setState({ currentFolderId: file.id });
        } else {
            const type = file.isDir ? 'folder' : 'file';
            const text = `Bạn đang mở ${type}: ${file.name}`;
            new Noty({ text: text, type: 'success', theme: 'relax', timeout: 3000 }).show();
        }
    };
    handleDownload = (file, inputEvent) => {
        console.log(file)
        if (file !== undefined) {
            const type = file[0].isDir ? 'folder' : 'file';
            const text = `Bạn đang tải ${type}: ${file[0].name}`;
            new Noty({ text: text, type: 'success', theme: 'relax', timeout: 3000 }).show();

        }


    }
    handleFolderCreate = (folder) => {
        console.log(folder)
        new Noty({ text: `Bạn đang tạo folder tại ${folder.name}.`, type: 'success', theme: 'relax', timeout: 3000 }).show();
        return this.showModal()
        // new Noty({ text: 'You tried to create a folder.', type: 'success', theme: 'relax', timeout: 3000 }).show();
    };
    handleUpload = (folder) => {
        new Noty({ text: `Bạn đang upload file tại ${folder.name}.`, type: 'success', theme: 'relax', timeout: 3000 }).show();
        return this.showModal1()
    }
    handleDeleteFiles = (file) => {
        console.log(file)
        if (file !== undefined) {
            this.setState({ name: file[0].name }, () => this.showConfirm())
        }

        // console.log(files)
        // new Noty({
        //     text: `You tried to delete ${files.length} file(s).`,
        //     type: 'success', theme: 'relax', timeout: 3000,
        // }).show();
    };

    thumbGenerator = (file) => {
        if (!file.thumbnailUrl) return null;
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(file.thumbnailUrl);
            image.onerror = () => reject(`Failed to load thumbnail for ${file.name}.`);
            image.src = file.thumbnailUrl;
        })
            .catch((error) => console.error(error));
    };
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    showModal1 = () => {
        this.setState({
            visible1: true,
        });
    };

    handleOk1 = e => {
        console.log(e);
        this.setState({
            visible1: false,
        });
    };

    handleCancel1 = e => {
        console.log(e);
        this.setState({
            visible1: false,
        });
    };
    showConfirm() {
        confirm({
            title: `Chú ý`,
            icon: <ExclamationCircleOutlined />,
            content: `Bạn có muốn xóa ${this.state.name}`,
            onOk() {
                console.log('OK');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    render() {
        const { currentFolderId } = this.state;
        const folder = this.fileMap[currentFolderId];

        const folderChain = [];
        let files = [];
        if (folder) {
            let currentFolder = folder;
            while (currentFolder) {
                folderChain.unshift(currentFolder);
                const parentId = currentFolder.parentId;
                currentFolder = parentId ? this.fileMap[parentId] : null;
            }
            if (folder.childrenIds) {
                files = folder.childrenIds.map(id => this.fileMap[id]);
            }
        }
        console.log(demoFileMap)
        const props = {
            name: 'file',
            multiple: true,
            action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            onChange(info) {
                const { status } = info.file;
                if (status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully.`);
                } else if (status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };


        console.log(this.state)
        return (
            <Card>
                <div style={{ height: 540 }}>
                    <Modal
                        title="Tạo thư mục"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        <Input placeholder="Nhập tên thư mục" />
                    </Modal>
                    <Modal
                        title="Upload File"
                        visible={this.state.visible1}
                        onOk={this.handleOk1}
                        onCancel={this.handleCancel1}
                    >
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                                band files
                    </p>
                        </Dragger>
                    </Modal>
                    <FileBrowser files={files} folderChain={folderChain} thumbnailGenerator={this.thumbGenerator}
                        onFileOpen={this.handleFileOpen} onFolderCreate={() => this.handleFolderCreate(folder)}
                        onUploadClick={() => this.handleUpload(folder)}
                        onDownloadFiles={this.handleDownload} onDeleteFiles={this.handleDeleteFiles}
                        fillParentContainer={true} view={FileView.SmallThumbs} />
                </div>
            </Card>);
    }

}
