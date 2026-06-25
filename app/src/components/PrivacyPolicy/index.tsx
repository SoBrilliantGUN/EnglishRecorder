import styles from './index.module.scss';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          返回
        </button>
        <h1 className={styles.title}>隐私政策</h1>
        <div className={styles.headerSpacer} />
      </header>

      <div className={styles.content}>
        <p className={styles.updateDate}>更新日期：2026 年 6 月 25 日</p>
        <p className={styles.updateDate}>生效日期：2026 年 6 月 25 日</p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>引言</h2>
          <p>EnglishPod 学习打卡（以下简称「我们」）深知个人信息对您的重要性，我们将按照法律法规的规定，保护您的个人信息安全。本《隐私政策》旨在向您说明我们如何收集、使用、存储和共享您的个人信息，以及您享有的相关权利。</p>
          <p>请您在使用我们的服务前，仔细阅读并了解本隐私政策。若您不同意本隐私政策的任何内容，请立即停止使用我们的服务。</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>一、我们收集的信息</h2>

          <h3 className={styles.subTitle}>1.1 您主动提供的信息</h3>
          <ul className={styles.list}>
            <li><strong>手机号码</strong>：用于账号注册和登录认证。我们采用手机验证码方式进行身份验证，您的手机号码将作为您的唯一账号标识，并上传至我们的后端服务器存储。</li>
            <li><strong>昵称</strong>：您可以选择设置昵称，用于个人资料展示。昵称将上传至我们的后端服务器。</li>
            <li><strong>头像</strong>：您可以选择上传头像图片，用于个人资料展示。头像文件将上传至阿里云对象存储（OSS），我们的后端服务器存储文件访问路径。</li>
          </ul>

          <h3 className={styles.subTitle}>1.2 我们自动收集的信息</h3>
          <p>为保障服务的稳定运行和优化用户体验，我们会通过第三方 SDK 自动收集以下信息：</p>

          <div className={styles.sdkTable}>
            <div className={styles.sdkRow}>
              <span className={styles.sdkLabel}>SDK 名称</span>
              <span className={styles.sdkValue}>阿里云短信认证 SDK</span>
            </div>
            <div className={styles.sdkRow}>
              <span className={styles.sdkLabel}>服务类型</span>
              <span className={styles.sdkValue}>短信验证</span>
            </div>
            <div className={styles.sdkRow}>
              <span className={styles.sdkLabel}>收集信息类型</span>
              <span className={styles.sdkValue}>设备名称、设备型号、系统版本</span>
            </div>
            <div className={styles.sdkRow}>
              <span className={styles.sdkLabel}>使用场景</span>
              <span className={styles.sdkValue}>客户端数据及问题分析</span>
            </div>
            <div className={styles.sdkRow}>
              <span className={styles.sdkLabel}>使用频次</span>
              <span className={styles.sdkValue}>调用发送短信验证码接口时使用，每次接口调用一次</span>
            </div>
            <div className={styles.sdkRow}>
              <span className={styles.sdkLabel}>隐私政策</span>
              <span className={styles.sdkValue}>
                <a href="https://terms.alicdn.com/legal-agreement/terms/privacy_policy_full/20230922101800634/20230922101800634.html" target="_blank" rel="noopener" className={styles.link}>
                  短信认证 SDK 隐私权政策
                </a>
              </span>
            </div>
          </div>

          <h3 className={styles.subTitle}>1.3 所需的系统权限</h3>
          <ul className={styles.list}>
            <li><strong>网络权限</strong>（android.permission.INTERNET）：用于发起网络访问请求，完成短信验证码的发送与校验。</li>
            <li><strong>网络状态权限</strong>（android.permission.ACCESS_NETWORK_STATE）：用于检查网络状态是否可用，确保短信验证服务的正常运行。</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>二、我们如何使用信息</h2>
          <ul className={styles.list}>
            <li>为您提供账号注册、登录与身份验证服务</li>
            <li>保障服务的正常运行和安全防护</li>
            <li>优化和改进我们的服务体验</li>
          </ul>
          <p>我们不会将您的个人信息用于本隐私政策未载明的其他用途，也不会将您的个人信息出售或分享给第三方，但法律法规要求或经您明确同意的情形除外。</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>三、信息的存储</h2>

          <h3 className={styles.subTitle}>3.1 存储方式</h3>
          <p>您的个人信息（手机号码、昵称、学习记录等）存储在我们的后端服务器中，服务器部署在阿里云弹性计算服务（ECS）上。头像等文件存储于阿里云对象存储（OSS）。</p>
          <p>您需要保持网络连接以使用本服务的全部功能。在您登录后，部分临时数据会缓存在本地浏览器（localStorage）中以维持会话状态。</p>

          <h3 className={styles.subTitle}>3.2 存储期限</h3>
          <p>我们会按照法律法规规定的期限保存您的个人信息。当您注销账号或数据超出法定保存期限后，我们将对您的个人信息进行删除或匿名化处理。</p>

          <h3 className={styles.subTitle}>3.3 数据安全</h3>
          <p>我们采取业界通行的安全措施保护您的个人信息，包括但不限于：数据传输使用 HTTPS 加密，服务器部署在具备安全防护的云环境中。但请注意，没有任何互联网传输或存储方式是百分之百安全的。</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>四、您的权利</h2>
          <ul className={styles.list}>
            <li><strong>查阅权</strong>：您可以在「个人中心」页面查看您的个人信息，也可以请求我们提供您个人信息的副本。</li>
            <li><strong>更正权</strong>：您可以在「个人中心」页面修改您的昵称和头像，修改将同步更新至服务器。</li>
            <li><strong>删除权</strong>：您可以通过「退出登录」删除本地缓存的个人信息，并可以通过注销账号请求我们删除服务器上存储的个人信息。</li>
            <li><strong>撤回同意</strong>：您可以随时通过退出登录或注销账号撤回对本隐私政策的同意。撤回同意不影响撤回前基于同意已进行的处理的合法性。</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>五、未成年人保护</h2>
          <p>我们高度重视未成年人的个人信息保护。如果您是未满 14 周岁的未成年人，请在监护人的陪同下阅读本隐私政策，并在获得监护人同意后使用我们的服务。</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>六、隐私政策的更新</h2>
          <p>我们可能会适时更新本隐私政策。更新后的隐私政策将在本页面发布，并在更新日期处标注最新修订日期。建议您定期查阅本隐私政策以了解最新内容。</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>七、联系我们</h2>
          <p>如果您对本隐私政策有任何疑问、意见或建议，请通过以下方式联系我们：</p>
          <ul className={styles.list}>
            <li>电子邮箱：493490244@qq.com</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
