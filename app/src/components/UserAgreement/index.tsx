import styles from './index.module.scss';

interface UserAgreementProps {
  onBack: () => void;
}

export default function UserAgreement({ onBack }: UserAgreementProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          返回
        </button>
        <h1 className={styles.title}>用户协议</h1>
        <div className={styles.headerSpacer} />
      </header>

      <div className={styles.content}>
        <p className={styles.updateDate}>更新日期：2026 年 6 月 25 日</p>
        <p className={styles.updateDate}>生效日期：2026 年 6 月 25 日</p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>引言</h2>
          <p>欢迎使用 EnglishPod 学习打卡（以下简称「本服务」）。本《用户协议》（以下简称「本协议」）是您与本服务开发者之间关于使用本服务的法律协议。</p>
          <p>请您在使用本服务前仔细阅读本协议。您通过点击「同意」按钮或以任何方式使用本服务，即视为您已阅读并同意接受本协议的约束。如果您不同意本协议的任何条款，请勿使用本服务。</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>一、服务说明</h2>
          <p>本服务是一个英语学习打卡工具，提供以下功能：</p>
          <ul className={styles.list}>
            <li>学习打卡记录与管理</li>
            <li>EnglishPod 课程内容浏览与学习</li>
            <li>艾宾浩斯复习提醒</li>
            <li>学习数据统计与分享</li>
            <li>个人账号信息管理</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>二、账号注册与管理</h2>
          <ul className={styles.list}>
            <li>您需要通过手机验证码方式完成注册和登录。您应保证提供的手机号码真实有效。</li>
            <li>您的账号仅限于您本人使用，不得将账号提供给第三方使用。</li>
            <li>您对账号下的所有活动承担全部责任，请妥善保管您的账号信息。</li>
            <li>如发现账号存在异常使用或安全风险，我们有权暂停或终止向您提供服务。</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>三、用户行为规范</h2>
          <p>您在使用本服务过程中，应遵守中华人民共和国相关法律法规，不得利用本服务从事以下行为：</p>
          <ul className={styles.list}>
            <li>发布、传播违法或不良信息</li>
            <li>侵犯他人知识产权、商业秘密或其他合法权益</li>
            <li>干扰或破坏本服务的正常运行</li>
            <li>利用技术手段非法获取数据或进行逆向工程</li>
            <li>其他违反法律法规或公序良俗的行为</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>四、知识产权</h2>
          <ul className={styles.list}>
            <li>本服务的软件著作权、商标权等知识产权归开发者所有。</li>
            <li>EnglishPod 课程内容（音频、文本）的版权归原权利人所有，本服务仅提供用于个人学习目的的内容展示，不构成任何版权授权或转让。您应当在持有原版课程授权的前提下使用相关内容。</li>
            <li>未经权利人许可，您不得将本服务中的任何内容用于商业目的。</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>五、免责声明</h2>
          <ul className={styles.list}>
            <li>本服务按「现状」提供，不作任何明示或默示的保证。</li>
            <li>您的学习记录和个人信息存储在我们的后端服务器（部署于阿里云）中。我们会对服务器数据进行定期备份，但仍建议您定期使用数据导出功能自行备份。因不可抗力、第三方服务故障等原因导致的数据丢失，我们不承担责任。</li>
            <li>因不可抗力、网络故障、系统维护等原因导致的服务中断，我们不承担责任。</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>六、协议变更</h2>
          <p>我们有权根据需要修改本协议。修改后的协议将在本页面公布，并标注最新更新日期。如您不同意修改后的协议，应停止使用本服务。继续使用本服务即视为接受修改后的协议。</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>七、法律适用与争议解决</h2>
          <ul className={styles.list}>
            <li>本协议的订立、执行和解释适用中华人民共和国法律。</li>
            <li>因本协议引起的或与本协议有关的争议，双方应友好协商解决；协商不成的，提交有管辖权的人民法院处理。</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>八、联系我们</h2>
          <p>如您对本协议有任何疑问，请通过以下方式联系我们：</p>
          <ul className={styles.list}>
            <li>电子邮箱：493490244@qq.com</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
