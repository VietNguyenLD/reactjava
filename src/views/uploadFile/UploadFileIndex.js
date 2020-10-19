// Import React as usual
import React from 'react';

// Import Noty for nice file open notifications
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/relax.css';
import { API_URL } from '../../config/Config';
import { ExclamationCircleOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    FormGroup,
    Label,
    FormText,
    Media,
    Spinner,
    CardFooter,
    TabContent, TabPane, Nav, NavItem, NavLink
} from "reactstrap";
// Import Chonky
import 'chonky/style/main.css';
import { FileBrowser, FileView, demoFileMap, demoRootFolderId } from 'chonky';
import {
    Modal, Button, Input, Upload, message, Row,
    Col, Typography
} from 'antd';
import 'antd/dist/antd.css';
import { GetListUpload, CreateFolder, UploadFile, DeleteFile, DownloadFile, GetListAfterUpload, CreateFolderRoot } from '../../actions/uploadActions';
import { saveAs } from 'file-saver';
import Lottie from "react-lottie";
import { TOKEN } from '../../constants/AppConst';
import * as animationData from "./heysiri.json";
const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData.default,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
};
const { Title } = Typography;
const { confirm } = Modal;
const key = 'updatable';
const { Dragger } = Upload;
class UploadFileIndex extends React.Component {

    constructor(props) {
        super(props);

        this.fileMap = demoFileMap;
        this.state = { fileMap: [], currentFolderId: '1', visible: false, visible1: false, name: '', fileList: [], isLoading: false, namefolder: '' };
    }
    componentDidMount() {
        this.props.GetListUpload({}, localStorage.getItem('UIDD'))
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.uploadReducer.dataupload !== prevProps.uploadReducer.dataupload) {
            if (this.props.uploadReducer.success === true) {
                this.setState({
                    currentFolderId: this.props.uploadReducer.dataupload.rootFolderId,
                    fileMap: this.props.uploadReducer.dataupload.fileMap,
                })
            } else {
                this.setState({
                    currentFolderId: null
                })
            }
        }
        if (this.props.uploadReducer.dataafter !== prevProps.uploadReducer.dataafter) {
            if (this.props.uploadReducer.dataafter.fileMap !== undefined) {
                this.setState({
                    currentFolderId: this.state.parent_id,
                    fileMap: this.props.uploadReducer.dataafter.fileMap,
                })
            }

        }
        if (this.props.uploadReducer.successcreate !== prevProps.uploadReducer.successcreate) {
            if (this.props.uploadReducer.successcreate === true) {
                new Noty({ text: `Tạo folder thành công`, type: 'success', theme: 'relax', timeout: 3000 }).show();
                this.props.GetListAfterUpload({}, localStorage.getItem('UIDD'))
                // window.location.reload()
            }
        }
        if (this.props.uploadReducer.successcreateroot !== prevProps.uploadReducer.successcreateroot) {
            if (this.props.uploadReducer.successcreateroot === true) {
                new Noty({ text: `Tạo folder thành công`, type: 'success', theme: 'relax', timeout: 3000 }).show();
                this.props.GetListUpload({}, localStorage.getItem('UIDD'))
                // window.location.reload()
            }
        }
        if (this.props.uploadReducer.successdelete !== prevProps.uploadReducer.successdelete) {
            if (this.props.uploadReducer.successdelete === true) {
                setTimeout(() => {
                    message.success({
                        content: 'Xóa file thành công!', key, duration: 2, className: 'custom-class',
                        style: {
                            marginTop: 150
                        },
                    });
                    // window.location.reload()
                    this.props.GetListAfterUpload({}, localStorage.getItem('UIDD'))
                }, 1000);
            }
        }
        if (this.props.uploadReducer.successdownload !== prevProps.uploadReducer.successdownload) {
            if (this.props.uploadReducer.successdownload === true) {
                setTimeout(() => {
                    message.success({
                        content: 'Tải file thành công!', key, duration: 2, className: 'custom-class',
                        style: {
                            marginTop: 150
                        },
                    });
                    saveAs(this.props.uploadReducer.datadownload)
                    // window.open(this.props.uploadReducer.datadownload, '_blank');
                    // window.location.reload()
                }, 1000);
            }
        }
    }
    handleUploads = () => {
        const { fileList } = this.state;
        this.setState({ isLoading: true })
        console.log(fileList)
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('file', file);
        });
        formData.append('obj_name', fileList[0].name);
        formData.append('obj_type', 'file');
        formData.append('parent_id', this.state.parent_id);
        formData.append('uid', '1310');

        message.loading({
            content: 'Đang tải lên....', key, className: 'custom-class',
            style: {
                marginTop: 150
            },
        });
        fetch(API_URL + 'v1/fs-object',
            {
                body: formData,
                method: "post",
                headers: new Headers({
                    Authorization: localStorage.getItem(TOKEN),
                })
            })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.success === true) {
                        setTimeout(() => {
                            message.success({
                                content: 'Upload thành công!', key, duration: 2, className: 'custom-class',
                                style: {
                                    marginTop: 150
                                },
                            });
                            this.handleCancel1()
                            this.setState({ isLoading: false,fileList: [] })
                            // window.location.reload()
                            this.props.GetListAfterUpload({}, localStorage.getItem('UIDD'))
                        }, 1000);
                    }
                })

    }

    handleFileOpen = (file) => {
        if (file.isDir) {
            this.setState({ currentFolderId: file.id });
        } else {
            // const type = file.isDir ? 'folder' : 'file';
            // const text = `Bạn đang mở ${type}: ${file.name}`;
            // new Noty({ text: text, type: 'success', theme: 'relax', timeout: 3000 }).show();
            message.loading({
                content: 'Đang tải xuống....', key, className: 'custom-class',
                style: {
                    marginTop: 150
                },
            });
            // const type = file[0].isDir ? 'folder' : 'file';
            // const text = `Bạn đang tải ${type}: ${file[0].name}`;
            // new Noty({ text: text, type: 'success', theme: 'relax', timeout: 3000 }).show();
            this.props.DownloadFile({}, file.id)
        }
    };
    handleDownload = (file, inputEvent) => {
        console.log(file)
        if (file !== undefined) {
            if (file[0].isDir === true) {
                return new Noty({ text: 'Chỉ được phép tải file', type: 'warning', theme: 'relax', timeout: 3000 }).show();
            }
            message.loading({
                content: 'Đang tải xuống....', key, className: 'custom-class',
                style: {
                    marginTop: 150
                },
            });
            // const type = file[0].isDir ? 'folder' : 'file';
            // const text = `Bạn đang tải ${type}: ${file[0].name}`;
            // new Noty({ text: text, type: 'success', theme: 'relax', timeout: 3000 }).show();
            this.props.DownloadFile({}, file[0].id)
        }


    }
    handleFolderCreate = (folder) => {
        console.log(folder)
        this.setState({ parent_id: folder.id })
        return this.showModal()
        // new Noty({ text: 'You tried to create a folder.', type: 'success', theme: 'relax', timeout: 3000 }).show();
    };
    handleFolderCreateRoot = () => {
        return this.showModal3()
    }
    handleUpload = (folder) => {
        this.setState({ parent_id: folder.id })
        // new Noty({ text: `Bạn đang upload file tại ${folder.name}.`, type: 'success', theme: 'relax', timeout: 3000 }).show();
        return this.showModal1()
    }
    handleDeleteFiles = (file) => {
        console.log(file)

        if (file !== undefined) {
            if (file[0].isDir === true) {
                return new Noty({ text: 'Chỉ được phép xóa file', type: 'warning', theme: 'relax', timeout: 3000 }).show();
            }
            this.setState({ name: file[0].name, iddelete: file[0].id, parent_id: file[0].parentId }, () => this.showConfirm())
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
    showModal3 = () => {
        this.props.CreateFolderRoot({})
    };
    handleOk = e => {
        console.log(e);
        if (this.state.namefolder === '') {
            return new Noty({ text: 'Vui lòng nhập vào tên thư mục', type: 'warning', theme: 'relax', timeout: 3000 }).show();
        }
        var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        if (format.test(this.state.namefolder)) {
            return new Noty({ text: 'Tên thư mục không được chứa ký tự đặc biệt', type: 'warning', theme: 'relax', timeout: 3000 }).show();
        } else {

            let params = {
                obj_name: this.state.namefolder,
                obj_type: 'folder',
                parent_id: this.state.parent_id,
                // uid: '1310'
            }
            this.props.CreateFolder(params)
            console.log(params)
            this.setState({
                visible: false,
            });
        }
    };
    handleOk3 = e => {
        console.log(e);
        if (this.state.namefolder === '') {
            return new Noty({ text: 'Vui lòng nhập vào tên thư mục', type: 'warning', theme: 'relax', timeout: 3000 }).show();
        }
        var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        if (format.test(this.state.namefolder)) {
            return new Noty({ text: 'Tên thư mục không được chứa ký tự đặc biệt', type: 'warning', theme: 'relax', timeout: 3000 }).show();
        } else {

            let params = {

            }
            this.props.CreateFolderRoot(params)
            console.log(params)
            this.setState({
                visible3: false,
            });
        }
    };
    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    handleCancel3 = e => {
        console.log(e);
        this.setState({
            visible3: false,
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
        let that = this;
        confirm({
            title: `Chú ý`,
            icon: <ExclamationCircleOutlined />,
            content: `Bạn có muốn xóa ${this.state.name}`,
            onOk() {
                message.loading({
                    content: 'Đang xóa file....', key, className: 'custom-class',
                    style: {
                        marginTop: 150
                    },
                });
                that.props.DeleteFile({}, that.state.iddelete)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    handleUploadFile = (info) => {
        const { status } = info.file;
        console.log(info)
        this.setState({ originFileObj: info.file.originFileObj })
        // let list_imgb64 = [];
        // info.fileList.forEach((item, index) => {
        //     // list_imgb64.push({ img_base64: item.thumbUrl.replace(/^data:(.*,)?/, '') })
        //     console.log(item.response);
        //     if (item.response) {
        //         // list_imgb64.push({ img_base64: item.thumbUrl.replace(/^data:(.*,)?/, '') })
        //         list_imgb64.push({ img_base64: item.response.base64_image.replace(/^data:(.*,)?/, '') })
        //     }
        // });

        // console.log(list_imgb64);

        // this.setState({
        //     listUploadImage: list_imgb64
        // })
    }
    render() {
        console.log(this.props)
        console.log(this.state)
        const { currentFolderId } = this.state;
        console.log(this.state.fileMap)
        const folder = this.state.fileMap[currentFolderId];
        console.log(currentFolderId)
        console.log(this.state.fileMap)
        console.log(folder)
        const folderChain = [];
        let files = [];
        if (folder) {
            let currentFolder = folder;
            while (currentFolder) {
                folderChain.unshift(currentFolder);
                const parentId = currentFolder.parentId;
                currentFolder = parentId ? this.state.fileMap[parentId] : null;
            }
            if (folder.childrenIds) {
                files = folder.childrenIds.map(id => this.state.fileMap[id]);
            }
        }
        console.log(files)
        // const props = {
        //     name: 'file',
        //     action: API_URL + 'v1/fs-object',
        //     headers: {
        //         authorization: 'authorization-text',
        //     },
        //     body: {
        //         obj_name: file.name,
        //         "obj_type": "file",
        //         parent_id: that.state.parent_id,
        //         uid: '1310',
        //         file: file
        //     },
        //     onChange(info) {
        //         if (info.file.status !== 'uploading') {
        //             console.log(info.file, info.fileList);
        //         }
        //         if (info.file.status === 'done') {
        //             message.success(`${info.file.name} file uploaded successfully`);
        //         } else if (info.file.status === 'error') {
        //             message.error(`${info.file.name} file upload failed.`);
        //         }
        //     },
        // };

        const { uploading, fileList } = this.state;
        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                this.setState(state => ({
                    fileList: [...state.fileList, file],
                }));
                return false;
            },
            fileList,
        };
        console.log(this.state)
        if (this.props.uploadReducer.isLoading || this.state.isLoading) {
            return (
                <div
                    className={{
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    style={{ marginTop: 100, }}
                >
                    <Lottie options={defaultOptions} height={350} width={350} />
                </div>
            );

        }
        return (
            <Card>
                <div style={{ height: 540, alignItems: 'center', alignContent: 'center' }}>
                    <Modal
                        title="Tạo thư mục"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        <Input onChange={(e) => this.setState({ namefolder: e.target.value })} placeholder="Nhập tên thư mục" />
                    </Modal>
                    <Modal
                        title="Tạo thư mục"
                        visible={this.state.visible3}
                        onOk={this.handleOk3}
                        onCancel={this.handleCancel3}
                    >
                        <Input onChange={(e) => this.setState({ namefolder: e.target.value })} placeholder="Nhập tên thư mục" />
                    </Modal>
                    <Modal
                        title="Upload File"
                        visible={this.state.visible1}
                        onOk={this.handleOk1}
                        onCancel={this.handleCancel1}
                        footer={[
                            <Button key="back" onClick={this.handleCancel1}>
                                Hủy
                            </Button>
                        ]}
                    >
                        <Upload {...props}>
                            <Button icon={<UploadOutlined />}>Select File</Button>
                        </Upload>
                        <Button
                            type="primary"
                            onClick={this.handleUploads}
                            disabled={fileList.length === 0}
                            loading={uploading}
                            style={{ marginTop: 16 }}
                        >
                            {uploading ? 'Uploading' : 'Start Upload'}
                        </Button>
                    </Modal>
                    {this.state.currentFolderId !== null ?
                        <FileBrowser files={files} folderChain={folderChain} thumbnailGenerator={this.thumbGenerator}
                            onFileOpen={this.handleFileOpen} onFolderCreate={() => this.handleFolderCreate(folder)}
                            onUploadClick={() => this.handleUpload(folder)}
                            onDownloadFiles={this.handleDownload} onDeleteFiles={this.handleDeleteFiles}
                            fillParentContainer={true} view={FileView.SmallThumbs} /> :
                        <div className="site-layout-background" style={{ padding: 24, textAlign: 'center' }}>
                            <Title level={3}>Bạn chưa tạo thư mục nào</Title>
                            <Button
                                type="primary"
                                onClick={this.handleFolderCreateRoot}
                                style={{ marginTop: 16 }}
                            >
                                Tạo thư mục gốc
                        </Button>
                        </div>
                        }
                </div>
            </Card>);
    }

}

function mapStateToProps(state) {
    return {
        uploadReducer: state.uploadReducer
    };
}

export default connect(mapStateToProps,
    {
        GetListUpload, CreateFolder, UploadFile, DeleteFile, DownloadFile, GetListAfterUpload, CreateFolderRoot
    })
    (UploadFileIndex);
